import React, { useEffect, useState } from "react";
import { getAgentProperties, deleteProperty } from "../../../api/agentApi";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import { Trash2, Clock, CheckCircle, XCircle, Eye, BedDouble, Bath, Home } from "lucide-react";

export default function AgentPropertiesList({ refreshSignal }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetch = async () => {
    setLoading(true);
    try {
      const data = await getAgentProperties();
      setItems(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, [refreshSignal]);

  const handleDelete = async (id) => {
    if (!confirm("Delete this property?")) return;
    try {
      await deleteProperty(id);
      toast.success("Property deleted");
      fetch();
    } catch (err) {
      console.error(err);
      toast.error('Delete failed');
    }
  };

  const getStatusBadge = (status) => {
    if (status === 'approved') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
          <CheckCircle className="w-3 h-3" />
          Approved
        </span>
      );
    }
    if (status === 'rejected') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
          <XCircle className="w-3 h-3" />
          Rejected
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
        <Clock className="w-3 h-3" />
        Pending
      </span>
    );
  };

  if (loading) return <div className="text-center py-8 text-gray-500">Loading your properties...</div>;
  if (items.length === 0) return (
    <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
      <p className="text-gray-500">You have no posted properties yet.</p>
      <p className="text-sm text-gray-400 mt-1">Start by adding your first listing!</p>
    </div>
  );

  return (
    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
      {items.map((p) => {
        const backendOrigin = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
        const firstImage = Array.isArray(p.image_urls) && p.image_urls.length ? p.image_urls[0] : (Array.isArray(p.images) ? p.images[0] : null);
        const resolveImage = () => {
          if (!firstImage) return null;
            if (/^https?:\/\//i.test(firstImage)) return firstImage;
            if (firstImage.startsWith('/storage/')) return `${backendOrigin}${firstImage}`;
            if (!firstImage.startsWith('/')) return `${backendOrigin}/storage/${firstImage}`;
            return firstImage;
        };
        return (
        <div key={p.id} className="border rounded-lg p-4 bg-gradient-to-br from-white to-gray-50 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800 text-lg">{p.title || p.name}</h3>
              <p className="text-sm text-gray-600 mt-1 flex items-center gap-1">
                {p.address || p.location}
              </p>
              {resolveImage() && (
                <img
                  src={resolveImage()}
                  alt={p.title}
                  className="w-full h-40 object-cover rounded mt-3"
                  onError={(e)=>{e.currentTarget.src='/images/properties/placeholder.jpg';}}
                />
              )}
              
              <div className="flex items-center gap-3 mt-2 text-xs text-gray-600">
                {p.type && (
                  <span className="flex items-center gap-1 capitalize">
                    <Home className="w-3 h-3" /> {p.type}
                  </span>
                )}
                {p.bedrooms && (
                  <span className="flex items-center gap-1">
                    <BedDouble className="w-3 h-3" /> {p.bedrooms} bed{p.bedrooms !== 1 ? 's' : ''}
                  </span>
                )}
                {p.bathrooms && (
                  <span className="flex items-center gap-1">
                    <Bath className="w-3 h-3" /> {p.bathrooms} bath{p.bathrooms !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
              
              <p className="text-blue-600 font-bold mt-2">GHS {Number(p.price).toLocaleString()}</p>
            </div>
            {getStatusBadge(p.status)}
          </div>
          
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => navigate(`/properties/${p.id}`)}
              className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium flex items-center justify-center gap-2"
            >
              <Eye className="w-4 h-4" />
              View
            </button>
            <button
              onClick={() => handleDelete(p.id)}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm font-medium flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>
        );
      })}
    </div>
  );
}
