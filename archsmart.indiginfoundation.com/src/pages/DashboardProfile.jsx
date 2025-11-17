import React, { useEffect, useState } from "react";
import DashboardLayout from "../features/dashboard/components/DashboardLayout";
import { User, Mail, Phone, MapPin, Calendar, Camera } from "lucide-react";
import api from "../api/axios";
import toast from "react-hot-toast";
import { useAuth } from "../contexts/AuthContext";
import { assetUrl, resolveUploadedUrl } from "../api/config";

export default function DashboardProfile() {
  const { user, refreshUser } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "", password_confirmation: "" });
  const [loading, setLoading] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [imageCheck, setImageCheck] = useState(null);

  useEffect(() => {
    if (user) {
      setForm((f) => ({ ...f, name: user.name || "", email: user.email || "" }));
  // add a cache-busting query so newly uploaded pictures show immediately
  setPreviewUrl(user.profile_picture_url ? resolveUploadedUrl(user.profile_picture_url) + `?t=${Date.now()}` : null);
    }
  }, [user]);

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

  // When user selects a new profile picture, clear any typed password fields
  // so they aren't accidentally submitted with the image update.
  // This avoids the UX where a previously typed new password 'repeats' when saving a picture.
  const handleFileChangeAndClearPassword = (e) => {
    handleFileChange(e);
    setForm((f) => ({ ...f, password: "", password_confirmation: "" }));
  };

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('email', form.email);
      formData.append('_method', 'PATCH');
      if (form.password) {
        formData.append('password', form.password);
        formData.append('password_confirmation', form.password_confirmation);
      }
      if (profilePicture) {
        formData.append('profile_picture', profilePicture);
      }

      // Debug: enumerate FormData so we can inspect what's being sent
      try {
        // Only log FormData entries in local dev to avoid exposing values in production
        if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
          for (const pair of formData.entries()) {
            console.debug('[profile submit] ', pair[0], pair[1]);
          }
        }
      } catch (err) {
        try { console.debug('Could not enumerate FormData entries', err); } catch (e) {}
      }

      const response = await api.post("/api/user", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      try {
        if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
          console.log('Profile update response:', response.data);
        }
      } catch (e) {}
      // refresh user in context and set a cache-busted preview URL from the fresh server value
      await refreshUser();
      try {
  const fresh = (await api.get('/api/user')).data || {};
  setPreviewUrl(fresh.profile_picture_url ? resolveUploadedUrl(fresh.profile_picture_url) + `?t=${Date.now()}` : null);
      } catch (err) {
        // fallback to context user (use cache-bust to encourage reload)
  setPreviewUrl(user?.profile_picture_url ? resolveUploadedUrl(user.profile_picture_url) + `?t=${Date.now()}` : null);
      }

      // Local-only diagnostic: attempt to HEAD the resolved image URL and store status/headers for UI
      try {
        if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
          const freshUser = (await api.get('/api/user')).data || {};
          const checkUrl = freshUser.profile_picture_url ? resolveUploadedUrl(freshUser.profile_picture_url) : null;
          if (checkUrl) {
            try {
              const r = await fetch(checkUrl, { method: 'HEAD', mode: 'cors' });
              const headersObj = {};
              try { for (const [k,v] of r.headers.entries()) headersObj[k] = v; } catch(e) {}
              setImageCheck({ url: checkUrl, status: r.status, headers: headersObj, error: null });
            } catch (e) {
              setImageCheck({ url: checkUrl, status: null, headers: null, error: String(e) });
            }
          }
        }
      } catch (e) {
        // ignore
      }

      toast.success("Profile updated");
      setForm((f) => ({ ...f, password: "", password_confirmation: "" }));
      setProfilePicture(null);
    } catch (e) {
      console.error('Profile update error:', e.response?.data || e);
      const resp = e.response?.data;
      if (resp && resp.errors) {
        const messages = Object.values(resp.errors).flat().join(' \n');
        toast.error(messages);
      } else {
        const msg = resp?.message || "Update failed";
        toast.error(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">User Profile</h1>
          <p className="text-sm text-gray-600 mt-1">View and manage your profile information</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-center">
              <div className="relative w-24 h-24 mx-auto mb-4">
                {previewUrl ? (
                  <img 
                    src={previewUrl} 
                    alt="Profile" 
                    className="w-24 h-24 rounded-full object-cover border-4 border-blue-500"
                  />
                ) : (
                  <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center">
                    <User className="w-12 h-12 text-white" />
                  </div>
                )}
                <label 
                  htmlFor="profile-upload" 
                  className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors"
                >
                  <Camera className="w-4 h-4" />
                </label>
                <input
                  id="profile-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChangeAndClearPassword}
                  className="hidden"
                />
              </div>
              <h2 className="text-xl font-bold text-gray-800">{user?.name || "—"}</h2>
              <p className="text-sm text-gray-500 capitalize">{user?.role || "user"}</p>
            </div>
            {/* Dev diagnostics panel (local only) */}
            {imageCheck && (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-gray-800">
                <div className="font-medium mb-1">Dev image diagnostics</div>
                <div className="break-words"><strong>URL:</strong> <a className="text-blue-600" href={imageCheck.url} target="_blank" rel="noreferrer">{imageCheck.url}</a></div>
                <div><strong>Status:</strong> {imageCheck.status ?? 'error'}</div>
                {imageCheck.error && <div className="text-red-600">Error: {imageCheck.error}</div>}
                {imageCheck.headers && (
                  <div className="mt-2 text-xs text-gray-700">
                    <div className="font-semibold">Headers:</div>
                    <pre className="whitespace-pre-wrap">{JSON.stringify(imageCheck.headers, null, 2)}</pre>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-md">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">Profile Information</h3>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input name="name" value={form.name} onChange={onChange} className="mt-1 block w-full rounded border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" name="email" value={form.email} onChange={onChange} className="mt-1 block w-full rounded border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">New Password</label>
                  <input type="password" name="password" value={form.password} onChange={onChange} className="mt-1 block w-full rounded border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                  <input type="password" name="password_confirmation" value={form.password_confirmation} onChange={onChange} className="mt-1 block w-full rounded border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>
              </div>
              <div className="flex justify-end">
                <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-60">
                  {loading ? 'Saving…' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Activity Section */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">Recent Activity</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-gray-800">Approved property listing</p>
                  <p className="text-sm text-gray-500">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-gray-800">Published new blog post</p>
                  <p className="text-sm text-gray-500">5 hours ago</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-gray-800">Updated user permissions</p>
                  <p className="text-sm text-gray-500">1 day ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
