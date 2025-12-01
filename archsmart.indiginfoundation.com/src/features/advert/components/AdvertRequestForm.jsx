import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import api from "../../../api/axios";
import PaystackButton from "./PaystackButton";

const AdvertRequestForm = ({ onSubmitted }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [form, setForm] = useState({
    businessName: "",
    businessCategory: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    websiteUrl: "",
    advertDetails: "",
    targetAudience: "",
    durationMonths: 1,
    budget: "",
    logo: null,
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [requestId, setRequestId] = useState(null);
  const [remoteStatus, setRemoteStatus] = useState(null); // track server status when polling
  const [submitIntent, setSubmitIntent] = useState(false); // only true when user clicks the final submit button
  const [errors, setErrors] = useState({});

  const businessCategories = [
    "Real Estate Agency",
    "Property Management",
    "Construction",
    "Interior Design",
    "Mortgage Services",
    "Insurance",
    "Legal Services",
    "Moving Services",
    "Home Inspection",
    "Other"
  ];

  const targetAudiences = [
    { value: "buyers", label: "Property Buyers" },
    { value: "sellers", label: "Property Sellers" },
    { value: "renters", label: "Renters" },
    { value: "investors", label: "Property Investors" },
    { value: "all", label: "All Users" }
  ];

  const durationOptions = [
    { value: 1, label: "1 Month - Ghs 8,000", price: 8000 },
    { value: 3, label: "3 Months - Ghs 21,600 (10% off)", price: 21600 },
    { value: 6, label: "6 Months - Ghs 38,400 (20% off)", price: 38400 },
    { value: 12, label: "12 Months - Ghs 67,200 (30% off)", price: 67200 }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 2 * 1024 * 1024) { // 2MB limit
      setErrors({ ...errors, logo: "File size must be less than 2MB" });
      return;
    }
    if (file && !file.type.startsWith('image/')) {
      setErrors({ ...errors, logo: "Please select an image file" });
      return;
    }
    setForm({ ...form, logo: file });
    if (errors.logo) {
      setErrors({ ...errors, logo: "" });
    }
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!form.businessName.trim()) newErrors.businessName = "Business name is required";
      if (!form.businessCategory) newErrors.businessCategory = "Business category is required";
      if (!form.contactName.trim()) newErrors.contactName = "Contact name is required";
      if (!form.contactEmail.trim()) newErrors.contactEmail = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(form.contactEmail)) newErrors.contactEmail = "Email is invalid";
      if (!form.contactPhone.trim()) newErrors.contactPhone = "Phone number is required";
    }

    if (step === 2) {
      if (!form.advertDetails.trim()) newErrors.advertDetails = "Advert details are required";
      if (!form.targetAudience) newErrors.targetAudience = "Target audience is required";
    }

    if (step === 3) {
      if (!form.durationMonths) newErrors.durationMonths = "Duration is required";
      if (form.websiteUrl && !/^https?:\/\/.+/.test(form.websiteUrl)) {
        newErrors.websiteUrl = "Website URL must start with http:// or https://";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(currentStep)) return;

    // Only submit the POST request when the user explicitly clicked the final Submit button.
    // (prevents pressing Enter from auto-submitting even on final step)
    if (!submitIntent) {
      // if not final step return to next step, otherwise silently ignore
      if (currentStep < 3) {
        setCurrentStep(currentStep + 1);
        return;
      }
      // final step + no explicit click -> don't submit
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      const formData = new FormData();

      // Transform camelCase to snake_case for backend
      const payload = {
        business_name: form.businessName,
        business_category: form.businessCategory,
        contact_name: form.contactName,
        contact_email: form.contactEmail,
        contact_phone: form.contactPhone,
        website_url: form.websiteUrl,
        advert_details: form.advertDetails,
        target_audience: form.targetAudience,
        duration_months: form.durationMonths,
        budget: form.budget || null,
      };

      Object.keys(payload).forEach(key => {
        if (payload[key] !== null && payload[key] !== undefined) {
          formData.append(key, payload[key]);
        }
      });

      if (form.logo) {
        formData.append('logo', form.logo);
      }

      const resp = await api.post("/api/advert-requests", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Try to capture the created request id (api may return { id } or { data: { id } })
      const createdId = resp?.data?.id ?? resp?.data?.data?.id ?? resp?.data?.request_id ?? null;
      if (createdId) {
        setRequestId(createdId);
        try { localStorage.setItem('advertRequestId', createdId); } catch (e) {}
      }

      setLoading(false);
      // reset submitIntent after successful POST
      setSubmitIntent(false);
      setStatus("pending");
      setRemoteStatus("pending");
      toast.success("Advert request submitted! Await admin approval.");
      if (onSubmitted) onSubmitted();
    } catch (err) {
      setLoading(false);
      setSubmitIntent(false);
      toast.error("Failed to submit request");
      console.error(err);
    }
  };

    // Poll remote status for the created request so we can show payment options when approved
    useEffect(() => {
      if (!requestId) return;

      let stopped = false;
      const check = async () => {
        try {
          const { data } = await api.get(`/api/advert-requests/${requestId}`);
          const s = data?.status ?? data?.data?.status ?? null;
          if (s && !stopped) setRemoteStatus(s);
        } catch (e) {
          // ignore polling errors
        }
      };

      // initial check and periodic polling
      check();
      const t = setInterval(check, 10000);
      return () => { stopped = true; clearInterval(t); };
    }, [requestId]);

  // On mount, recover a saved request id so the user can come back later to pay
  useEffect(() => {
    try {
      const saved = localStorage.getItem('advertRequestId');
      if (saved) setRequestId(saved);
    } catch (e) {}
  }, []);

  const selectedDuration = durationOptions.find(opt => opt.value === parseInt(form.durationMonths));

  const renderStep1 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Information</h3>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Business Name *</label>
        <input
          type="text"
          name="businessName"
          value={form.businessName}
          onChange={handleChange}
          className={`w-full border rounded px-3 py-2 ${errors.businessName ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="Enter your business name"
        />
        {errors.businessName && <p className="text-red-500 text-sm mt-1">{errors.businessName}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Business Category *</label>
        <select
          name="businessCategory"
          value={form.businessCategory}
          onChange={handleChange}
          className={`w-full border rounded px-3 py-2 ${errors.businessCategory ? 'border-red-500' : 'border-gray-300'}`}
        >
          <option value="">Select a category</option>
          {businessCategories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
        {errors.businessCategory && <p className="text-red-500 text-sm mt-1">{errors.businessCategory}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Contact Name *</label>
        <input
          type="text"
          name="contactName"
          value={form.contactName}
          onChange={handleChange}
          className={`w-full border rounded px-3 py-2 ${errors.contactName ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="Enter contact person name"
        />
        {errors.contactName && <p className="text-red-500 text-sm mt-1">{errors.contactName}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email *</label>
        <input
          type="email"
          name="contactEmail"
          value={form.contactEmail}
          onChange={handleChange}
          className={`w-full border rounded px-3 py-2 ${errors.contactEmail ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="Enter contact email"
        />
        {errors.contactEmail && <p className="text-red-500 text-sm mt-1">{errors.contactEmail}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone *</label>
        <input
          type="tel"
          name="contactPhone"
          value={form.contactPhone}
          onChange={handleChange}
          className={`w-full border rounded px-3 py-2 ${errors.contactPhone ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="Enter contact phone number"
        />
        {errors.contactPhone && <p className="text-red-500 text-sm mt-1">{errors.contactPhone}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Website URL (Optional)</label>
        <input
          type="url"
          name="websiteUrl"
          value={form.websiteUrl}
          onChange={handleChange}
          className={`w-full border rounded px-3 py-2 ${errors.websiteUrl ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="https://yourwebsite.com"
        />
        {errors.websiteUrl && <p className="text-red-500 text-sm mt-1">{errors.websiteUrl}</p>}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Advert Details</h3>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Advert Description *</label>
        <textarea
          name="advertDetails"
          value={form.advertDetails}
          onChange={handleChange}
          className={`w-full border rounded px-3 py-2 ${errors.advertDetails ? 'border-red-500' : 'border-gray-300'}`}
          rows={4}
          placeholder="Describe what you want to promote and how you can help customers..."
        />
        {errors.advertDetails && <p className="text-red-500 text-sm mt-1">{errors.advertDetails}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Target Audience *</label>
        <div className="grid grid-cols-2 gap-2">
          {targetAudiences.map(audience => (
            <label key={audience.value} className="flex items-center">
              <input
                type="radio"
                name="targetAudience"
                value={audience.value}
                checked={form.targetAudience === audience.value}
                onChange={handleChange}
                className="mr-2"
              />
              {audience.label}
            </label>
          ))}
        </div>
        {errors.targetAudience && <p className="text-red-500 text-sm mt-1">{errors.targetAudience}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Business Logo (Optional)</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className={`w-full border rounded px-3 py-2 ${errors.logo ? 'border-red-500' : 'border-gray-300'}`}
        />
        <p className="text-sm text-gray-500 mt-1">Max file size: 2MB. Recommended: 200x200px</p>
        {errors.logo && <p className="text-red-500 text-sm mt-1">{errors.logo}</p>}
        {form.logo && (
          <div className="mt-2">
            <img src={URL.createObjectURL(form.logo)} alt="Logo preview" className="w-20 h-20 object-cover rounded" />
          </div>
        )}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing & Duration</h3>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Advert Duration *</label>
        <div className="space-y-2">
          {durationOptions.map(option => (
            <label key={option.value} className="flex items-center p-3 border rounded cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="durationMonths"
                value={option.value}
                checked={parseInt(form.durationMonths) === option.value}
                onChange={handleChange}
                className="mr-3"
              />
              <div>
                <div className="font-medium">{option.label}</div>
                <div className="text-sm text-gray-500">
                  Ghs {option.price.toLocaleString()} total
                  {option.value > 1 && ` (Ghs ${(option.price / option.value).toLocaleString()}/month)`}
                </div>
              </div>
            </label>
          ))}
        </div>
        {errors.durationMonths && <p className="text-red-500 text-sm mt-1">{errors.durationMonths}</p>}
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-semibold text-blue-900 mb-2">Selected Package</h4>
        {selectedDuration && (
          <div className="text-blue-800">
            <p><strong>Duration:</strong> {selectedDuration.label}</p>
            <p><strong>Total Cost:</strong> Ghs {selectedDuration.price.toLocaleString()}</p>
            <p className="text-sm mt-2">Payment will be requested after admin approval.</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[1, 2, 3].map(step => (
            <div key={step} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step <= currentStep ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {step}
              </div>
              {step < 3 && (
                <div className={`w-16 h-1 mx-2 ${
                  step < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-sm text-gray-600">
          <span>Business Info</span>
          <span>Advert Details</span>
          <span>Pricing</span>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}

        <div className="flex justify-between mt-8">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={prevStep}
              className="px-6 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
            >
              Previous
            </button>
          )}

          {currentStep < 3 ? (
            <button
              type="button"
              onClick={nextStep}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 ml-auto"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              onClick={() => setSubmitIntent(true)}
              className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 ml-auto font-semibold"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Request"}
            </button>
          )}
        </div>
      </form>

      {status === "pending" && (
        <div className="mt-6 text-green-700 bg-green-100 p-4 rounded-lg">
          <h4 className="font-semibold mb-2">Request Submitted Successfully!</h4>
          <p>Your advert request is pending admin approval. You will be contacted for payment if approved.</p>
          <div className="mt-3 flex items-center gap-3">
            <button
              type="button"
              onClick={async () => {
                // Allow users to check current status immediately
                if (!requestId) return toast.error('Unable to locate request');
                try {
                  const { data } = await api.get(`/api/advert-requests/${requestId}`);
                  const s = data?.status ?? data?.data?.status ?? null;
                  setRemoteStatus(s);
                  toast.success(`Status: ${s}`);
                } catch (e) {
                  toast.error('Failed to fetch status');
                }
              }}
              className="px-3 py-1 text-sm bg-white rounded border"
            >
              Check Status
            </button>
            {remoteStatus && (
              <div className="text-sm text-gray-700">Current: <strong>{remoteStatus}</strong></div>
            )}
          </div>
        </div>
      )}

      {/* If server marks it approved, show payment options so the requester can pay */}
      {requestId && remoteStatus === 'approved' && (
        <div className="mt-6 p-6 bg-white border rounded-lg shadow-sm">
          <h4 className="text-lg font-semibold mb-3">Your request has been approved — please complete payment</h4>
          <p className="text-sm text-gray-600 mb-4">Choose a payment method to complete your advert activation.</p>

          <div className="flex flex-col md:flex-row gap-4 items-start">
            <div className="flex-1">
              <div className="mb-3 text-sm text-gray-700">Pay securely with Paystack (Card / Mobile money)</div>
              <PaystackButton
                email={form.contactEmail || ''}
                amount={selectedDuration ? selectedDuration.price : 0}
                onSuccess={async (reference) => {
                  // mark paid on success
                  try {
                    await api.patch(`/api/advert-requests/${requestId}/mark-paid`, { payment_method: 'paystack', payment_reference: reference });
                    setRemoteStatus('paid');
                    setStatus('paid');
                    toast.success('Payment successful — your advert will be activated soon');
                  } catch (e) {
                    toast.error('Payment recorded, but failed to update server status');
                  }
                }}
              />
            </div>

            <div className="w-full md:w-80 p-4 border rounded">
              <div className="text-sm font-medium mb-2">Alternative / Manual Payment</div>
              <form onSubmit={async (e) => {
                e.preventDefault();
                const formEl = e.target;
                const method = formEl.payment_method?.value || 'manual';
                const reference = formEl.payment_reference?.value;
                if (!reference) return toast.error('Please provide a payment reference');
                try {
                  await api.patch(`/api/advert-requests/${requestId}/mark-paid`, { payment_method: method, payment_reference: reference });
                  setRemoteStatus('paid');
                  setStatus('paid');
                  toast.success('Thanks — payment recorded, advert will be activated');
                } catch (err) {
                  toast.error('Failed to record payment');
                }
              }}>
                <select name="payment_method" defaultValue="momo" className="w-full border rounded px-2 py-1 mb-2">
                  <option value="momo">MTN Mobile Money</option>
                  <option value="card">Card (Mastercard / Visa)</option>
                  <option value="manual">Manual</option>
                </select>
                <input name="payment_reference" placeholder="Payment reference" className="w-full border rounded px-2 py-1 mb-2" required />
                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">Submit Payment Reference</button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvertRequestForm;
