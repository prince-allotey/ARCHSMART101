import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { MapPin, Home, BedDouble, Bath, User, Phone, Mail, Loader2, ArrowLeft } from "lucide-react";
import api from "../../../api/axios";
import { useAuth } from "../../../contexts/AuthContext";
import { BACKEND_ORIGIN } from "../../../api/config";

const AgentPropertiesPage = () => {
  const { agentId } = useParams();
  const { user } = useAuth();
  const [properties, setProperties] = useState([]);
  const [agent, setAgent] = useState(null);
  const [loading, setLoading] = useState(true);

  // Resolve image path similar to PropertiesSection
  const resolveImage = (path) => {
    if (!path) return '/images/properties/placeholder.jpg';
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    if (path.startsWith('/storage/')) return `${BACKEND_ORIGIN}${path}`;
    if (path.startsWith('storage/')) return `${BACKEND_ORIGIN}/${path.startsWith('/') ? path : path}`;
    // If backend stored full Storage::url output it may include /storage already
    return path;
  };

  useEffect(() => {
    const loadProperties = async () => {
      try {
        // If viewing your own agent page while logged in as agent, fetch all your properties (includes pending/rejected)
        if (user?.role === 'agent' && String(user.id) === String(agentId)) {
          const resMine = await api.get(`/api/properties/my`);
          const list = Array.isArray(resMine.data) ? resMine.data : [];
          setProperties(list);
          // Use current user as agent header
          setAgent({ name: user.name, email: user.email, phone: user.phone, bio: user.bio });
          return;
        }

        // If admin, fetch all then filter by agentId to include non-approved
        if (user?.role === 'admin') {
          const resAll = await api.get(`/api/properties/my`);
          const allList = Array.isArray(resAll.data) ? resAll.data : [];
          const filtered = allList.filter(p => String(p.agent_id) === String(agentId));
          setProperties(filtered);
          // Try to use agent from first item if present; otherwise leave null
          if (filtered.length > 0 && filtered[0].agent) {
            setAgent(filtered[0].agent);
          }
          return;
        }

        // Public: approved properties only
        const res = await api.get(`/api/properties/agent/${agentId}`);
        setProperties(res.data || []);
        if (res.data && res.data.length > 0) {
          setAgent(res.data[0].agent);
        }
      } catch (err) {
        console.error("Failed to fetch agent properties:", err);
      } finally {
        setLoading(false);
      }
    };
    
    loadProperties();
  }, [agentId, user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin w-8 h-8 text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Link to="/" className="flex items-center text-gray-600 hover:text-gray-800 mb-4">
            <ArrowLeft size={18} className="mr-1" /> Back to Home
          </Link>
          
          {agent && (
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-white" />
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900">{agent.name}</h1>
                <p className="text-gray-600 mt-1">Property Agent</p>
                <div className="flex items-center gap-4 mt-3 text-sm text-gray-700">
                  {agent.email && (
                    <a href={`mailto:${agent.email}`} className="flex items-center gap-1 hover:text-blue-600">
                      <Mail className="w-4 h-4" /> {agent.email}
                    </a>
                  )}
                  {agent.phone && (
                    <a href={`tel:${agent.phone}`} className="flex items-center gap-1 hover:text-blue-600">
                      <Phone className="w-4 h-4" /> {agent.phone}
                    </a>
                  )}
                </div>
                {agent.bio && (
                  <p className="text-gray-600 mt-3 max-w-2xl">{agent.bio}</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Properties Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {properties.length} {properties.length === 1 ? 'Property' : 'Properties'} Listed
        </h2>

        {properties.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">This agent has no properties listed yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <Link
                key={property.id}
                to={`/properties/${property.id}`}
                className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow overflow-hidden"
              >
                {property.images && property.images.length > 0 ? (
                  <div className="h-48 overflow-hidden">
                    <img
                      src={resolveImage(property.images[0])}
                      alt={property.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => { e.currentTarget.src = '/images/properties/placeholder.jpg'; }}
                    />
                  </div>
                ) : (
                  <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                    <Home className="w-16 h-16 text-gray-400" />
                  </div>
                )}

                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {property.title}
                  </h3>
                  {/* Status badge (visible to owner/admin when non-approved) */}
                  {((user?.role === 'agent' && String(user.id) === String(agentId)) || user?.role === 'admin') && property.status && (
                    <div className="mb-2">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        property.status === 'approved' ? 'bg-green-100 text-green-800' :
                        property.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {property.status}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-1 text-sm text-gray-600 mb-3">
                    <MapPin className="w-4 h-4" />
                    <span className="line-clamp-1">{property.location || property.address}</span>
                  </div>

                  <div className="flex items-center gap-3 mb-3 text-xs text-gray-600">
                    {property.type && (
                      <span className="flex items-center gap-1 capitalize">
                        <Home className="w-3 h-3" /> {property.type}
                      </span>
                    )}
                    {property.bedrooms && (
                      <span className="flex items-center gap-1">
                        <BedDouble className="w-3 h-3" /> {property.bedrooms}
                      </span>
                    )}
                    {property.bathrooms && (
                      <span className="flex items-center gap-1">
                        <Bath className="w-3 h-3" /> {property.bathrooms}
                      </span>
                    )}
                  </div>

                  <div className="text-xl font-bold text-blue-600">
                    GHS {Number(property.price).toLocaleString()}
                  </div>
                  {property.status !== 'approved' && ((user?.role === 'agent' && String(user.id) === String(agentId)) || user?.role === 'admin') && (
                    <p className="mt-1 text-xs text-gray-500">Not publicly visible until approved.</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentPropertiesPage;
