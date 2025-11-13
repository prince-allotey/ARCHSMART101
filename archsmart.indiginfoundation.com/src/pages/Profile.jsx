import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role === "agent") {
      fetchAgentProperties();
    }
  }, [user]);

  const fetchAgentProperties = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:8000/api/properties/my", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProperties(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Please log in to view your profile.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">My Profile</h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Profile Info */}
          <div className="space-y-3">
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> {user.role}</p>

            <button
              onClick={handleLogout}
              className="mt-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-2 rounded-lg hover:opacity-90"
            >
              Logout
            </button>
          </div>

          {/* Role-specific section */}
          {user.role === "agent" && (
            <div>
              <h2 className="text-xl font-semibold text-gray-700 mb-3">
                Your Properties
              </h2>
              {loading ? (
                <p>Loading properties...</p>
              ) : properties.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {properties.map((property) => (
                    <li key={property.id} className="py-2">
                      <div className="flex justify-between">
                        <div>
                          <p className="font-medium">{property.title}</p>
                          <p className="text-sm text-gray-500 capitalize">
                            Status: {property.status}
                          </p>
                        </div>
                        <button
                          onClick={() => navigate(`/agent/edit-property/${property.id}`)}
                          className="text-amber-600 hover:underline text-sm"
                        >
                          Edit
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No properties uploaded yet.</p>
              )}

              <button
                onClick={() => navigate("/agent/add-property")}
                className="mt-5 inline-block bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-2 rounded-lg hover:opacity-90"
              >
                + Add New Property
              </button>
            </div>
          )}

          {user.role === "user" && (
            <div>
              <h2 className="text-xl font-semibold text-gray-700 mb-3">
                Saved Properties
              </h2>
              <p className="text-gray-500 text-sm">
                (This section can later show user’s saved or inquired properties)
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
