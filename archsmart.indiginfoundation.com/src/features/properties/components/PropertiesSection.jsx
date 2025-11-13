import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BedDouble, MapPin, Home, Heart, Loader2, Lock, ArrowRight, X } from "lucide-react";
import api from "../../../api/axios";
import { mockProperties } from "../../../data/mockData";
import { useAuth } from "../../../contexts/AuthContext";

const PropertiesSection = ({ searchFilters }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSignupBanner, setShowSignupBanner] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(() => {
    return localStorage.getItem('hideSignupBanner') === 'true';
  });

  const GUEST_PROPERTY_LIMIT = 6; // Number of properties guests can view

  // Helper function to get the correct image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    // Already absolute
    if (/^https?:\/\//i.test(imagePath)) return imagePath;
    // Backend storage path
    if (imagePath.startsWith('/storage/')) {
      return `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'}${imagePath}`;
    }
    // Stored relative path like 'properties/xyz.jpg' from Laravel -> map to /storage/
    if (!imagePath.startsWith('/')) {
      return `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'}/storage/${imagePath}`;
    }
    return imagePath; // fallback
  };

  useEffect(() => {
    const saved = localStorage.getItem("favorites");
    if (saved) setFavorites(JSON.parse(saved));
    
    // Fetch properties from API
    const fetchProperties = async () => {
      setLoading(true);
      try {
        const response = await api.get("/api/properties");
        const apiProperties = response.data || [];
        
        // Use API properties if available, otherwise fallback to mock data
        if (apiProperties.length > 0) {
          setProperties(apiProperties);
        } else {
          setProperties(mockProperties);
        }
      } catch (error) {
        console.error("Failed to fetch properties:", error);
        // Fallback to mock properties if API fails
        setProperties(mockProperties);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProperties();
  }, []);

  // Filter properties based on search criteria
  const filterProperties = (properties) => {
    if (!searchFilters) return properties;

    return properties.filter((property) => {
      // Location filter
      if (searchFilters.location && searchFilters.location !== "") {
        const propertyLocation = property.location?.toLowerCase() || "";
        const searchLocation = searchFilters.location.toLowerCase();
        
        if (!propertyLocation.includes(searchLocation)) {
          return false;
        }
      }

      // Type filter
      if (searchFilters.type && searchFilters.type !== "") {
        const propertyType = property.type?.toLowerCase() || "";
        const searchType = searchFilters.type.toLowerCase();
        
        if (propertyType !== searchType) {
          return false;
        }
      }

      // Price range filter
      if (searchFilters.priceRange && searchFilters.priceRange !== "") {
        const price = parseFloat(property.price) || 0;
        
        if (searchFilters.priceRange === "0-200000") {
          if (price >= 200000) return false;
        } else if (searchFilters.priceRange === "200000-500000") {
          if (price < 200000 || price >= 500000) return false;
        } else if (searchFilters.priceRange === "500000-1000000") {
          if (price < 500000 || price >= 1000000) return false;
        } else if (searchFilters.priceRange === "1000000+") {
          if (price < 1000000) return false;
        }
      }

      return true;
    });
  };

  const filteredProperties = filterProperties(properties);

  // Limit properties for non-authenticated users (compute early so hooks can use values)
  const displayedProperties = user
    ? filteredProperties
    : filteredProperties.slice(0, GUEST_PROPERTY_LIMIT);
  const hasMoreProperties = !user && filteredProperties.length > GUEST_PROPERTY_LIMIT;
  const hiddenPropertiesCount = Math.max(0, filteredProperties.length - GUEST_PROPERTY_LIMIT);

  const toggleFavorite = (id) => {
    const updated = favorites.includes(id)
      ? favorites.filter((fid) => fid !== id)
      : [...favorites, id];
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  // Decide banner visibility once after properties load
  useEffect(() => {
    if (!user && hasMoreProperties && !bannerDismissed) {
      setShowSignupBanner(true);
    }
  }, [user, hasMoreProperties, bannerDismissed]);

  const dismissBanner = () => {
    setShowSignupBanner(false);
    setBannerDismissed(true);
    localStorage.setItem('hideSignupBanner', 'true');
  };

  // Decide what to render without returning early (preserves hook order)
  let content;
  if (loading) {
    content = (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="animate-spin w-8 h-8 text-blue-600" />
      </div>
    );
  } else if (filteredProperties.length === 0) {
    content = (
      <div className="text-center py-20">
        <p className="text-gray-500 text-lg">No properties found matching your criteria.</p>
        {searchFilters && (
          <p className="text-gray-400 text-sm mt-2">Try adjusting your search filters</p>
        )}
      </div>
    );
  } else {
    content = (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedProperties.map((property) => {
        const isFavorite = favorites.includes(property.id);
        return (
          <div
            key={property.id}
            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 relative group"
          >
            <div className="relative">
              {(() => {
                const primary = (Array.isArray(property.image_urls) && property.image_urls.length)
                  ? property.image_urls[0]
                  : (Array.isArray(property.images) && property.images.length ? property.images[0] : null);
                return primary ? (
                  <img
                  src={getImageUrl(primary)}
                  alt={property.title}
                  className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/images/properties/placeholder.jpg';
                  }}
                />
                ) : (
                <div className="w-full h-56 bg-gray-200 flex items-center justify-center text-gray-500">
                  No Image Available
                </div>
              )})()}

              {property.is_smart_home && (
                <span className="absolute top-3 left-3 bg-emerald-600 text-white text-xs px-3 py-1 rounded-full shadow">
                  Smart Home
                </span>
              )}

              {property.isSmartHome && (
                <span className="absolute top-3 left-3 bg-emerald-600 text-white text-xs px-3 py-1 rounded-full shadow">
                  Smart Home
                </span>
              )}

              <button
                onClick={() => toggleFavorite(property.id)}
                className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md shadow-md transition ${
                  isFavorite
                    ? "bg-red-500 text-white"
                    : "bg-white/80 text-gray-600 hover:text-red-500"
                }`}
              >
                <Heart
                  size={18}
                  fill={isFavorite ? "white" : "none"}
                  className="transition-transform duration-200 hover:scale-110"
                />
              </button>
            </div>

            <div className="p-5">
              <h3 className="text-xl font-bold text-gray-900 mb-1">
                {property.title}
              </h3>

              <div className="flex items-center text-gray-600 mb-3">
                <MapPin className="w-4 h-4 mr-1 text-blue-500" />
                {property.location}
              </div>

              <div className="flex items-center justify-between text-sm text-gray-700 mb-3">
                <div className="flex items-center gap-2">
                  <Home className="w-4 h-4 text-gray-500" /> {property.type}
                </div>
                {property.bedrooms && (
                  <div className="flex items-center gap-1">
                    <BedDouble className="w-4 h-4 text-gray-500" /> {property.bedrooms} beds
                  </div>
                )}
              </div>

              <div className="text-lg font-bold text-emerald-600 mb-4">
                {new Intl.NumberFormat("en-GH", {
                  style: "currency",
                  currency: "GHS",
                  maximumFractionDigits: 0,
                }).format(property.price)}
              </div>

              <button
                onClick={() => navigate(`/properties/${property.id}`)}
                className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 text-white py-2 rounded-lg font-semibold hover:opacity-90 transition"
              >
                View Details
              </button>
            </div>
          </div>
        );
        })}
      </div>
    );
  }

  return (
    <>
      {content}
      {/* Inline Signup Banner (non-intrusive) */}
      {showSignupBanner && (
        <div className="mt-10 max-w-6xl mx-auto px-4">
          <div className="relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-5 sm:p-7 shadow-md">
            {/* Decorative accents */}
            <span className="pointer-events-none absolute -top-20 -right-20 h-60 w-60 rounded-full bg-blue-100 blur-3xl opacity-60" />
            <span className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-emerald-100 blur-3xl opacity-60" />

            <button
              onClick={dismissBanner}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
              aria-label="Dismiss signup banner"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex items-start gap-4 md:max-w-2xl">
                <div className="mt-1 hidden sm:flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-amber-700 text-xs font-semibold mb-2">
                    Unlock full access
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
                    View {hiddenPropertiesCount}+ additional properties instantly
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Create a free account to unlock the full catalog, save favorites, and receive price alerts.
                  </p>
                  <ul className="flex flex-wrap gap-3 text-xs text-gray-700">
                    <li className="flex items-center gap-1"><span className="w-2 h-2 bg-emerald-500 rounded-full"></span>Save Favorites</li>
                    <li className="flex items-center gap-1"><span className="w-2 h-2 bg-indigo-500 rounded-full"></span>Instant Alerts</li>
                    <li className="flex items-center gap-1"><span className="w-2 h-2 bg-amber-500 rounded-full"></span>Contact Agents</li>
                    <li className="flex items-center gap-1"><span className="w-2 h-2 bg-pink-500 rounded-full"></span>Smart Home Deals</li>
                  </ul>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 md:justify-end md:flex-shrink-0">
                <button
                  onClick={() => navigate('/signup')}
                  className="px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-md transition flex items-center justify-center gap-2"
                >
                  Create Free Account <ArrowRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="px-5 py-3 bg-white text-gray-700 rounded-xl font-semibold border border-gray-200 hover:bg-gray-50 transition"
                >
                  Login
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PropertiesSection;
