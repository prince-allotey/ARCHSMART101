import React, { useState, useEffect } from "react";
import { BedDouble, MapPin, Home, Heart } from "lucide-react";

const PropertyCard = ({ property, onViewDetails }) => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("favorites");
    if (saved) setFavorites(JSON.parse(saved));
  }, []);

  const toggleFavorite = (id) => {
    const updated = favorites.includes(id)
      ? favorites.filter((fid) => fid !== id)
      : [...favorites, id];
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  const isFavorite = favorites.includes(property.id);

  const backendOrigin = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
  const resolveImage = () => {
    const list = (Array.isArray(property.image_urls) && property.image_urls.length)
      ? property.image_urls
      : (Array.isArray(property.images) ? property.images : []);
    const first = list[0];
    if (!first) return null;
    if (/^https?:\/\//i.test(first)) return first;
    if (first.startsWith('/storage/')) return `${backendOrigin}${first}`;
    if (!first.startsWith('/')) return `${backendOrigin}/storage/${first}`;
    return first;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 relative group">
      <div className="relative">
        {resolveImage() ? (
          <img
            src={resolveImage()}
            alt={property.title}
            className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => { e.currentTarget.src = '/images/properties/placeholder.jpg'; }}
          />
        ) : (
          <div className="w-full h-56 bg-gray-200 flex items-center justify-center text-gray-500">
            No Image Available
          </div>
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
        <h3 className="text-xl font-bold text-gray-900 mb-1">{property.title}</h3>

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
          onClick={() => onViewDetails(property)}
          className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 text-white py-2 rounded-lg font-semibold hover:opacity-90 transition"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default PropertyCard;
