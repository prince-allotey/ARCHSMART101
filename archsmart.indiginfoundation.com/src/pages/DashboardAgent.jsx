import React, { useState, useEffect } from "react";
import DashboardLayout from "../features/dashboard/components/DashboardLayout";
import AgentPropertyForm from "../features/properties/components/AgentPropertyForm";
import AgentPropertiesList from "../features/properties/components/AgentPropertiesList";
import { useAuth } from "../contexts/AuthContext";
import { Phone, Mail, User, MapPin, Building2, TrendingUp, Camera } from "lucide-react";
import api from "../api/axios";
import toast from 'react-hot-toast';

export default function DashboardAgent() {
  const [refresh, setRefresh] = useState(0);
  const { user, refreshUser } = useAuth();
  const [profile, setProfile] = useState({ name: "", email: "", phone: "", bio: "" });
  const [editMode, setEditMode] = useState(false);
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0 });
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        bio: user.bio || "",
      });
      setPreviewUrl(user.profile_picture_url);
    }
  }, [user]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/api/properties/my");
        const properties = res.data || [];
        setStats({
          total: properties.length,
          pending: properties.filter(p => p.status === 'pending').length,
          approved: properties.filter(p => p.status === 'approved').length,
        });
      } catch (err) {
        console.error("Failed to fetch stats:", err);
      }
    };
    fetchStats();
  }, [refresh]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const formData = new FormData();
      formData.append('name', profile.name);
      formData.append('email', profile.email);
      formData.append('phone', profile.phone);
      formData.append('bio', profile.bio);
      formData.append('_method', 'PATCH');
      if (profilePicture) {
        formData.append('profile_picture', profilePicture);
      }

      const response = await api.post("/api/user", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      
      console.log('Profile update response:', response.data);
      await refreshUser();
      toast.success("Profile updated successfully");
      setEditMode(false);
      setProfilePicture(null);
    } catch (err) {
      console.error('Profile update error:', err.response?.data || err);
      toast.error(err.response?.data?.message || "Failed to update profile");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <header className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome, {user?.name}</h1>
              <p className="text-blue-100">Manage your property listings and grow your business</p>
            </div>
            <div className="hidden md:block">
              <Building2 className="w-20 h-20 opacity-20" />
            </div>
          </div>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Properties</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">{stats.total}</p>
              </div>
              <Building2 className="w-12 h-12 text-blue-500 opacity-75" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-amber-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Pending Review</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">{stats.pending}</p>
              </div>
              <TrendingUp className="w-12 h-12 text-amber-500 opacity-75" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Approved & Live</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">{stats.approved}</p>
              </div>
              <Building2 className="w-12 h-12 text-green-500 opacity-75" />
            </div>
          </div>
        </div>

        {/* Agent Contact Details Card */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Your Contact Information</h2>
            <div className="flex gap-2">
              {editMode && (
                <button
                  onClick={() => {
                    setEditMode(false);
                    setProfile({
                      name: user.name || "",
                      email: user.email || "",
                      phone: user.phone || "",
                      bio: user.bio || "",
                    });
                    setProfilePicture(null);
                    setPreviewUrl(user.profile_picture_url);
                  }}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition text-sm"
                >
                  Cancel
                </button>
              )}
              <button
                onClick={() => editMode ? handleSaveProfile() : setEditMode(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
              >
                {editMode ? "Save Changes" : "Edit Profile"}
              </button>
            </div>
          </div>

          {/* Profile Picture */}
          <div className="flex items-center gap-6 mb-6 pb-6 border-b">
            <div className="relative">
              {previewUrl ? (
                <img 
                  src={previewUrl} 
                  alt="Profile" 
                  className="w-20 h-20 rounded-full object-cover border-4 border-blue-500"
                />
              ) : (
                <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center">
                  <User className="w-10 h-10 text-white" />
                </div>
              )}
              {editMode && (
                <label 
                  htmlFor="agent-profile-upload" 
                  className="absolute bottom-0 right-0 bg-blue-600 text-white p-1.5 rounded-full cursor-pointer hover:bg-blue-700 transition-colors"
                >
                  <Camera className="w-3 h-3" />
                </label>
              )}
              <input
                id="agent-profile-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
            <div className="flex-1">
              {editMode ? (
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="text-lg font-semibold text-gray-800 border rounded px-3 py-1 w-full mb-1"
                  placeholder="Your name"
                />
              ) : (
                <h3 className="text-lg font-semibold text-gray-800">{user?.name}</h3>
              )}
              <p className="text-sm text-gray-600 capitalize">{user?.role}</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <Mail className="w-5 h-5 text-blue-600 mt-1" />
              <div className="flex-1">
                <p className="text-sm text-gray-600 font-medium">Email</p>
                {editMode ? (
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="mt-1 w-full border rounded px-2 py-1"
                    placeholder="your@email.com"
                  />
                ) : (
                  <p className="text-gray-800">{user?.email}</p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <Phone className="w-5 h-5 text-green-600 mt-1" />
              <div className="flex-1">
                <p className="text-sm text-gray-600 font-medium">Phone</p>
                {editMode ? (
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    className="mt-1 w-full border rounded px-2 py-1"
                    placeholder="e.g. +233 123 456 789"
                  />
                ) : (
                  <p className="text-gray-800">{profile.phone || "Not provided"}</p>
                )}
              </div>
            </div>

            <div className="md:col-span-2 flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <User className="w-5 h-5 text-purple-600 mt-1" />
              <div className="flex-1">
                <p className="text-sm text-gray-600 font-medium">Bio</p>
                {editMode ? (
                  <textarea
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    className="mt-1 w-full border rounded px-2 py-1"
                    rows={3}
                    placeholder="Tell potential clients about yourself..."
                  />
                ) : (
                  <p className="text-gray-800">{profile.bio || "No bio added yet"}</p>
                )}
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> This information will be displayed on your property listings so clients can contact you directly.
            </p>
          </div>
        </div>

        {/* Property Management Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Building2 className="w-6 h-6 text-blue-600" />
              Post a New Property
            </h2>
            <AgentPropertyForm onCreated={() => setRefresh((r) => r + 1)} />
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <MapPin className="w-6 h-6 text-green-600" />
              Your Listings
            </h2>
            <AgentPropertiesList refreshSignal={refresh} />
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
