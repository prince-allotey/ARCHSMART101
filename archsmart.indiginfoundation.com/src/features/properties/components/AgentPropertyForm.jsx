import React, { useState } from "react";
import { createProperty } from "../../../api/propertyApi";
import toast from 'react-hot-toast';
import { Upload, ImagePlus, DollarSign, MapPin, FileText, Phone, Mail, Home, BedDouble, Bath, Ruler, Zap } from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";

export default function AgentPropertyForm({ onCreated }) {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState("");
  const [agentPhone, setAgentPhone] = useState(user?.phone || "");
  const [agentEmail, setAgentEmail] = useState(user?.email || "");
  const [agentName, setAgentName] = useState(user?.name || "");
  const [propertyType, setPropertyType] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [size, setSize] = useState("");
  const [isSmartHome, setIsSmartHome] = useState(false);

  const handleFiles = (files) => {
    const arr = Array.from(files).slice(0, 6);
    setImages(arr);
    const p = arr.map((f) => URL.createObjectURL(f));
    setPreviews(p);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if contact details are filled
    if (!agentPhone || !agentEmail || !agentName) {
      toast.error("Please fill in your contact details before posting a property");
      return;
    }
    
    if (!title || !location || !price) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    setLoading(true);
    try {
      const form = new FormData();
      form.append("title", title);
      form.append("location", location);
      form.append("price", price);
      form.append("description", description);
      
      if (propertyType) form.append("type", propertyType);
      if (bedrooms) form.append("bedrooms", bedrooms);
      if (bathrooms) form.append("bathrooms", bathrooms);
      if (size) form.append("size", size);
      form.append("is_smart_home", isSmartHome ? "1" : "0");
      
      if (agentName) form.append("agent_name", agentName);
      if (agentPhone) form.append("agent_phone", agentPhone);
      if (agentEmail) form.append("agent_email", agentEmail);
      
      images.forEach((file) => form.append("images[]", file));

      const created = await createProperty(form);
      toast.success("Property posted successfully! Awaiting admin approval.");
      
      setTitle("");
      setLocation("");
      setPrice("");
      setDescription("");
      setPropertyType("");
      setBedrooms("");
      setBathrooms("");
      setSize("");
      setIsSmartHome(false);
      setImages([]);
      setPreviews([]);
      
      if (onCreated) onCreated(created);
    } catch (err) {
      console.error("Create property failed:", err);
      const serverErrors = err?.response?.data || err?.message || "Failed to create property";
      if (err?.response?.status === 422 && serverErrors.errors) {
        const messages = Object.values(serverErrors.errors).flat().join("\n");
        toast.error(messages);
      } else if (typeof serverErrors === 'string') {
        toast.error(serverErrors);
      } else {
        toast.error("Failed to create property. Check console for details.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Property Title <span className="text-red-500">*</span>
        </label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          placeholder="Ex: Modern 2BR apartment in East Legon"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          Location <span className="text-red-500">*</span>
        </label>
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          placeholder="Ex: East Legon, Accra"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
            <Home className="w-4 h-4" />
            Property Type <span className="text-red-500">*</span>
          </label>
          <select
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            required
          >
            <option value="">Select type</option>
            <option value="apartment">Apartment</option>
            <option value="house">House</option>
            <option value="mansion">Mansion</option>
            <option value="land">Land</option>
            <option value="commercial">Commercial</option>
            <option value="villa">Villa</option>
            <option value="townhouse">Townhouse</option>
            <option value="duplex">Duplex</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            Price (GHS) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            placeholder="Ex: 500000"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
            <BedDouble className="w-4 h-4" />
            Bedrooms
          </label>
          <input
            type="number"
            value={bedrooms}
            onChange={(e) => setBedrooms(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            placeholder="Ex: 3"
            min="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
            <Bath className="w-4 h-4" />
            Bathrooms
          </label>
          <input
            type="number"
            value={bathrooms}
            onChange={(e) => setBathrooms(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            placeholder="Ex: 2"
            min="0"
          />
        </div>
      </div>

      {/* Size field - especially for land */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
          <Ruler className="w-4 h-4" />
          Size {propertyType === 'land' && <span className="text-red-500">*</span>}
        </label>
        <input
          type="number"
          value={size}
          onChange={(e) => setSize(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          placeholder={propertyType === 'land' ? "Ex: 2000 (in sqm)" : "Ex: 1500 (in sqft or sqm)"}
          min="0"
          required={propertyType === 'land'}
        />
        <p className="text-xs text-gray-500 mt-1">
          {propertyType === 'land' ? 'Enter size in square meters (sqm)' : 'Enter property size (optional)'}
        </p>
      </div>

      {/* Smart Home Feature */}
      <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
        <input
          type="checkbox"
          id="smartHome"
          checked={isSmartHome}
          onChange={(e) => setIsSmartHome(e.target.checked)}
          className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
        />
        <label htmlFor="smartHome" className="flex items-center gap-2 cursor-pointer">
          <Zap className="w-5 h-5 text-blue-600" />
          <div>
            <span className="text-sm font-semibold text-gray-800">Smart Home Property</span>
            <p className="text-xs text-gray-600">This property includes smart home features (automation, security, etc.)</p>
          </div>
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          placeholder="Describe the property features, amenities, and selling points..."
        />
      </div>

      {/* Agent Contact Details Section */}
      <div className="border-t pt-4 mt-4 bg-amber-50 p-4 rounded-lg border-2 border-amber-200">
        <h3 className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
          <Phone className="w-4 h-4 text-amber-600" />
          Your Contact Details <span className="text-red-500">*</span>
        </h3>
        <p className="text-xs text-amber-700 mb-3 font-medium">
          ⚠️ These fields are required. Buyers need to know how to contact you about this property.
        </p>
        
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Contact Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={agentName}
              onChange={(e) => setAgentName(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="Your name"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1 flex items-center gap-1">
              <Phone className="w-3 h-3" />
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              value={agentPhone}
              onChange={(e) => setAgentPhone(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="+233 123 456 789"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1 flex items-center gap-1">
              <Mail className="w-3 h-3" />
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={agentEmail}
              onChange={(e) => setAgentEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="your.email@example.com"
              required
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
          <ImagePlus className="w-4 h-4" />
          Property Images (up to 6)
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-500 transition cursor-pointer bg-gray-50">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleFiles(e.target.files)}
            className="hidden"
            id="image-upload"
          />
          <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center">
            <Upload className="w-12 h-12 text-gray-400 mb-2" />
            <p className="text-sm text-gray-600 font-medium">Click to upload images</p>
            <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 10MB each</p>
          </label>
        </div>
        
        {previews.length > 0 && (
          <div className="mt-4 grid grid-cols-3 gap-3">
            {previews.map((p, i) => (
              <div key={i} className="relative group">
                <img
                  src={p}
                  alt={`preview-${i}`}
                  className="w-full h-24 object-cover rounded-lg shadow-sm"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition rounded-lg" />
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition font-semibold shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? "Posting Property..." : "Post Property"}
      </button>
      
      <p className="text-xs text-gray-500 text-center">
        Your property will be reviewed by an admin before being published.
      </p>
    </form>
  );
}
