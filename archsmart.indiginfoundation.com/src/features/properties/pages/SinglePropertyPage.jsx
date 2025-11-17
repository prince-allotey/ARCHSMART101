import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
// Note: removed mockProperties import to avoid showing demo data when API fails
import { MapPin, Home, BedDouble, Loader2, Heart, ChevronLeft, ChevronRight, ArrowLeft, Phone, Mail, User, AlertCircle, MessageSquare, PhoneCall, Eye, EyeOff, Clock } from "lucide-react";
import api from "../../../api/axios";
import toast from "react-hot-toast";
import { assetUrl } from "../../../api/config";
// images will be rendered with <img> using getImageUrl

const SinglePropertyPage = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageIndex, setImageIndex] = useState(0);
  const [favorites, setFavorites] = useState([]);
  const [showFullPhone, setShowFullPhone] = useState(false);
  const [showCallbackForm, setShowCallbackForm] = useState(false);
  const [callbackData, setCallbackData] = useState({
    name: "",
    phone: "",
    preferredTime: ""
  });

  // Helper function to get the correct image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (/^https?:\/\//i.test(imagePath)) return imagePath;
    const origin = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
    if (imagePath.startsWith('/storage/')) return `${origin}${imagePath}`;
    if (!imagePath.startsWith('/')) return `${origin}/storage/${imagePath}`;
    return imagePath;
  };

  useEffect(() => {
    const saved = localStorage.getItem("favorites");
    if (saved) setFavorites(JSON.parse(saved));
    
    const loadProperty = async () => {
      try {
        // Try authenticated endpoint first (allows viewing pending properties)
        const token = localStorage.getItem("token");
        let res;
        
        if (token) {
          try {
            res = await api.get(`/api/properties/${id}/view`);
          } catch (authErr) {
            // If authenticated endpoint fails, try public endpoint
            if (authErr.response?.status === 404 || authErr.response?.status === 403) {
              res = await api.get(`/api/properties/${id}`);
            } else {
              throw authErr;
            }
          }
        } else {
          // No token, use public endpoint
          res = await api.get(`/api/properties/${id}`);
        }
        
        setProperty(res.data);
      } catch (err) {
        console.error("Failed to fetch property:", err);
        if (err.response?.status === 403) {
          toast.error("You don't have permission to view this property");
        } else if (err.response?.status === 404) {
          toast.error("Property not found");
        } else {
          // Do not fallback to demo data - surface the error to the user instead
          toast.error("Failed to load property");
          setProperty(null);
        }
      } finally {
        setLoading(false);
      }
    };
    
    loadProperty();
  }, [id]);

  const toggleFavorite = (id) => {
    const updated = favorites.includes(id)
      ? favorites.filter((fid) => fid !== id)
      : [...favorites, id];
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  // Helpers to normalize and dedupe image lists (handles string paths and object shapes)
  const normalizeImages = (arr) => {
    if (!Array.isArray(arr)) return [];
    const mapped = arr
      .map((it) => {
        if (!it) return null;
        if (typeof it === 'string') return it;
        // common object shapes from APIs
        if (it.url) return it.url;
        if (it.path) return it.path;
        if (it.filename) return it.filename;
        return null;
      })
      .filter(Boolean);
    // preserve order but remove exact duplicates
    return Array.from(new Set(mapped));
  };

  const nextImage = () => {
    const images = normalizeImages(property?.image_urls || property?.images || []);
    if (images.length) setImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    const images = normalizeImages(property?.image_urls || property?.images || []);
    if (images.length) setImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const maskPhoneNumber = (phone) => {
    if (!phone) return "";
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.length <= 4) return phone;
    const visibleDigits = 3;
    const start = cleaned.slice(0, visibleDigits);
    const end = cleaned.slice(-2);
    const masked = "*".repeat(cleaned.length - visibleDigits - 2);
    return `${start}${masked}${end}`;
  };

  const handleCallbackRequest = async (e) => {
    e.preventDefault();
    
    if (!callbackData.name || !callbackData.phone) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      await api.post("/api/inquiries", {
        name: callbackData.name,
        email: property.agent?.email || "",
        phone: callbackData.phone,
        subject: `Callback Request - ${property.title}`,
        message: `Requesting a callback for property: ${property.title}\nPreferred time: ${callbackData.preferredTime || "Anytime"}`,
        type: "property-inquiry",
        property_id: property.id
      });

      toast.success("Callback request sent successfully!");
      setShowCallbackForm(false);
      setCallbackData({ name: "", phone: "", preferredTime: "" });
    } catch (error) {
      console.error("Failed to send callback request:", error);
      toast.error("Failed to send callback request. Please try again.");
    }
  };

  useEffect(() => {
    // Reset image index when property changes so first image is shown
    setImageIndex(0);
  }, [property?.id]);

  if (loading) {
    return (<div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin w-8 h-8 text-blue-600" /></div>);
  }

  if (!property) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-600">
        <p>Property not found.</p>
        <Link to="/" className="mt-4 text-blue-600 hover:underline font-medium">← Back to listings</Link>
      </div>
    );
  }

  const isFavorite = favorites.includes(property.id);
  const agent = property.agent || property.user;
  
  // Use property-specific contact info if provided, otherwise fall back to agent profile
  const contactName = property.agent_name || agent?.name;
  const contactPhone = property.agent_phone || agent?.phone;
  const contactEmail = property.agent_email || agent?.email;
  const contactBio = agent?.bio;

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
        <Link to="/" className="flex items-center text-gray-600 hover:text-gray-800">
          <ArrowLeft size={18} className="mr-1" /> Back to Listings
        </Link>
        <button
          onClick={() => toggleFavorite(property.id)}
          className={`p-2 rounded-full ${isFavorite ? "text-red-500" : "text-gray-400 hover:text-red-500"}`}
        >
          <Heart fill={isFavorite ? "red" : "none"} />
        </button>
      </div>

      {(() => {
        const images = normalizeImages(property.image_urls || property.images || []);
        return images.length > 0 && (
          <div className="relative max-w-6xl mx-auto px-4 mb-8">
            <img
              src={assetUrl(images[imageIndex])}
              alt={property.title}
              className="w-full h-[500px] object-cover rounded-2xl shadow-lg"
              onError={(e) => { e.currentTarget.src = assetUrl('/properties/1.jpg'); }}
            />
            {images.length > 1 && (
              <>
                <button onClick={prevImage} className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2"><ChevronLeft size={22} /></button>
                <button onClick={nextImage} className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2"><ChevronRight size={22} /></button>
              </>
            )}
          </div>
        );
      })()}

      <div className="max-w-6xl mx-auto px-4">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Property Info */}
          <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-sm">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{property.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-4">
              <span className="flex items-center gap-1"><MapPin size={18} /> {property.location || property.address}</span>
              <span className="flex items-center gap-1 capitalize"><Home size={18} /> {property.type}</span>
              {property.bedrooms && <span className="flex items-center gap-1"><BedDouble size={18} /> {property.bedrooms} beds</span>}
            </div>
            <div className="text-3xl font-bold text-emerald-600 mb-6">
              GHS {Number(property.price).toLocaleString()}
            </div>
            
            <div className="border-t pt-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-3">Description</h2>
              <p className="text-gray-700 leading-relaxed">{property.description}</p>
            </div>

            {property.features && (
              <div className="border-t pt-6 mt-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-3">Features</h2>
                <ul className="grid grid-cols-2 gap-2">
                  {property.features.map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-gray-700">
                      <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                      {feat}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Disclaimer */}
            <div className="border-t pt-6 mt-6">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-amber-900 mb-2">Disclaimer</h3>
                    <p className="text-sm text-amber-800 leading-relaxed">
                      The information displayed about this property comprises a property advertisement. 
                      Archsmart makes no warranty as to the accuracy or completeness of the advertisement 
                      or any linked or associated information, and Archsmart has no control over the content. 
                      This property listing does not constitute property particulars. The information is 
                      provided and maintained by the listing agent. Archsmart shall not in any way be held 
                      liable for the actions of any agent and/or property owner/landlord on or off this website.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Safety Tips */}
            <div className="border-t pt-6 mt-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-red-900 mb-2">SAFETY TIPS</h3>
                    <ul className="text-sm text-red-800 leading-relaxed space-y-2">
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-red-600 rounded-full flex-shrink-0 mt-1.5"></span>
                        <span>Do not make any upfront payment as inspection fee or upfront payment for rent before seeing this property or seeing the agent you contacted physically.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-red-600 rounded-full flex-shrink-0 mt-1.5"></span>
                        <span>Private Property is not liable for monetary transactions between you and the agents.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-red-600 rounded-full flex-shrink-0 mt-1.5"></span>
                        <span>The contact agent on properties listed on Private Property does not represent Private Property.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-red-600 rounded-full flex-shrink-0 mt-1.5"></span>
                        <span>Private Property will not mandate agents to ask for fees upfront.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Verification & Reporting */}
            <div className="border-t pt-6 mt-6">
              {property.status === 'approved' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-green-800">
                      <div className="w-5 h-5 bg-green-600 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="font-semibold text-sm">Listing Is Verified As Real</span>
                    </div>
                  </div>

                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">If Reported As Fake, We'll Investigate</span>
                      <Link
                        to="/contact"
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                      >
                        Report Listing
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-amber-800">
                      <div className="w-5 h-5 bg-amber-600 rounded-full flex items-center justify-center">
                        <Clock className="w-3 h-3 text-white" />
                      </div>
                      <span className="font-semibold text-sm">This listing is pending admin approval</span>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Have concerns? Contact us</span>
                      <Link
                        to="/contact"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                      >
                        Contact Support
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Agent Contact Card */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white p-6 rounded-2xl shadow-lg sticky top-6">
              <h3 className="text-xl font-bold mb-4">Contact Agent</h3>
              
              {(contactName || contactPhone || contactEmail) ? (
                <div className="space-y-4">
                  {contactName && (
                    <div className="flex items-center gap-3 bg-white/10 rounded-lg p-3">
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-semibold">{contactName}</p>
                        <p className="text-sm text-blue-100">Property Agent</p>
                      </div>
                    </div>
                  )}

                  {contactPhone && (
                    <div className="space-y-2">
                      {/* Call Number */}
                      <div className="bg-white/10 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            <p className="text-xs text-blue-100">Call Number</p>
                          </div>
                          <button
                            onClick={() => setShowFullPhone(!showFullPhone)}
                            className="text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded flex items-center gap-1 transition"
                          >
                            {showFullPhone ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                            {showFullPhone ? "Hide" : "Show"}
                          </button>
                        </div>
                        <p className="font-medium">
                          {showFullPhone ? contactPhone : maskPhoneNumber(contactPhone)}
                        </p>
                        {showFullPhone && (
                          <a
                            href={`tel:${contactPhone}`}
                            className="mt-2 block text-center bg-green-500 hover:bg-green-600 text-white py-2 rounded text-sm font-medium transition"
                          >
                            Call Now
                          </a>
                        )}
                      </div>

                      {/* WhatsApp Number */}
                      <div className="bg-white/10 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <MessageSquare className="w-4 h-4" />
                            <p className="text-xs text-blue-100">WhatsApp Number</p>
                          </div>
                        </div>
                        <p className="font-medium mb-2">
                          {showFullPhone ? contactPhone : maskPhoneNumber(contactPhone)}
                        </p>
                        {showFullPhone && (
                          <a
                            href={`https://wa.me/${contactPhone.replace(/\D/g, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-center bg-green-500 hover:bg-green-600 text-white py-2 rounded text-sm font-medium transition"
                          >
                            Chat on WhatsApp
                          </a>
                        )}
                      </div>

                      {/* Request a Call Button */}
                      <button
                        onClick={() => setShowCallbackForm(!showCallbackForm)}
                        className="w-full bg-white/20 hover:bg-white/30 text-white py-2.5 rounded-lg font-medium transition flex items-center justify-center gap-2"
                      >
                        <PhoneCall className="w-4 h-4" />
                        Request a Call
                      </button>

                      {/* Callback Form */}
                      {showCallbackForm && (
                        <div className="bg-white/10 rounded-lg p-4 mt-2">
                          <h4 className="font-semibold mb-3 text-sm">Request a Callback</h4>
                          <form onSubmit={handleCallbackRequest} className="space-y-3">
                            <div>
                              <input
                                type="text"
                                placeholder="Your Name *"
                                value={callbackData.name}
                                onChange={(e) => setCallbackData({ ...callbackData, name: e.target.value })}
                                className="w-full px-3 py-2 rounded bg-white/20 border border-white/30 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50 text-sm"
                                required
                              />
                            </div>
                            <div>
                              <input
                                type="tel"
                                placeholder="Your Phone Number *"
                                value={callbackData.phone}
                                onChange={(e) => setCallbackData({ ...callbackData, phone: e.target.value })}
                                className="w-full px-3 py-2 rounded bg-white/20 border border-white/30 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50 text-sm"
                                required
                              />
                            </div>
                            <div>
                              <input
                                type="text"
                                placeholder="Preferred Time (Optional)"
                                value={callbackData.preferredTime}
                                onChange={(e) => setCallbackData({ ...callbackData, preferredTime: e.target.value })}
                                className="w-full px-3 py-2 rounded bg-white/20 border border-white/30 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50 text-sm"
                              />
                            </div>
                            <button
                              type="submit"
                              className="w-full bg-white text-blue-600 py-2 rounded font-semibold hover:bg-blue-50 transition text-sm"
                            >
                              Submit Request
                            </button>
                          </form>
                        </div>
                      )}
                    </div>
                  )}

                  {contactEmail && (
                    <a
                      href={`mailto:${contactEmail}`}
                      className="flex items-center gap-3 bg-white/10 hover:bg-white/20 rounded-lg p-3 transition"
                    >
                      <Mail className="w-5 h-5" />
                      <div>
                        <p className="text-xs text-blue-100">Email</p>
                        <p className="font-medium text-sm break-all">{contactEmail}</p>
                      </div>
                    </a>
                  )}

                  {contactBio && (
                    <div className="bg-white/10 rounded-lg p-3 mt-4">
                      <p className="text-sm text-blue-50">{contactBio}</p>
                    </div>
                  )}

                  {contactEmail && (
                    <button
                      onClick={() => window.open(`mailto:${contactEmail}?subject=Inquiry about ${property.title}`, '_blank')}
                      className="w-full bg-white text-blue-600 py-3 rounded-lg font-semibold hover:bg-blue-50 transition mt-4"
                    >
                      Send Message
                    </button>
                  )}

                  {property.agent_id && (
                    <Link
                      to={`/properties/agent/${property.agent_id}`}
                      className="w-full block text-center bg-white/20 hover:bg-white/30 text-white py-2 rounded-lg font-medium transition mt-2 text-sm"
                    >
                      View All Listings
                    </Link>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-blue-100">Contact information not available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SinglePropertyPage;
