import React, { useEffect, useState } from "react";
import DashboardLayout from "../features/dashboard/components/DashboardLayout";
import { User, Mail, Lock, Bell, Shield } from "lucide-react";
import api from "../api/axios";
import toast from "react-hot-toast";
import { useAuth } from "../contexts/AuthContext";

export default function DashboardSettings() {
  const { refreshUser } = useAuth();
  // Profile form state
  const [profile, setProfile] = useState({ name: "", email: "" });
  const [savingProfile, setSavingProfile] = useState(false);

  // Password form state
  const [pwd, setPwd] = useState({ current_password: "", password: "", password_confirmation: "" });
  const [savingPwd, setSavingPwd] = useState(false);
  // Keep password inputs readonly until user focuses them to avoid aggressive browser autofill
  const [pwdInputsReadonly, setPwdInputsReadonly] = useState(true);
  const [showPwdForm, setShowPwdForm] = useState(false);

  // Notification preferences (local only for now)
  const [prefs, setPrefs] = useState({ email: true, push: false });

  useEffect(() => {
    // Load user profile
    const load = async () => {
      try {
        const res = await api.get("/api/user");
        const u = res.data || {};
        setProfile({ name: u.name || "", email: u.email || "" });
      } catch (e) {
        toast.error("Failed to load settings");
      }
    };
    // Load prefs from localStorage
    const emailPref = localStorage.getItem("pref.notifications.email");
    const pushPref = localStorage.getItem("pref.notifications.push");
    setPrefs({
      email: emailPref === null ? true : emailPref === "true",
      push: pushPref === "true",
    });

    load();
    // Reset password form state on mount to avoid stale saving state or browser autofill
    setPwd({ current_password: "", password: "", password_confirmation: "" });
    setSavingPwd(false);

    // Keep inputs readonly until user interacts to reduce browser autofill chances.
    setPwdInputsReadonly(true);

    // Clear native DOM values shortly after mount to ensure React-controlled values stay empty.
    setTimeout(() => {
      try {
        const passFields = document.querySelectorAll('input[type="password"]');
        passFields.forEach((el) => {
          if (el && el instanceof HTMLInputElement) el.value = '';
        });
      } catch (e) {
        // ignore
      }
    }, 150);
  }, []);

  const onProfileChange = (e) => setProfile({ ...profile, [e.target.name]: e.target.value });
  const onPwdChange = (e) => setPwd({ ...pwd, [e.target.name]: e.target.value });

  const saveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const formData = new FormData();
      formData.append('name', profile.name);
      formData.append('email', profile.email);
      formData.append('_method', 'PATCH');
      
      const res = await api.post("/api/user", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      await refreshUser();
      toast.success("Profile updated");
      // Keep form in sync with server response if present
      const u = res.data?.user || res.data;
      if (u?.name || u?.email) setProfile({ name: u.name || profile.name, email: u.email || profile.email });
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || "Update failed";
      toast.error(msg);
    } finally {
      setSavingProfile(false);
    }
  };

  const updatePassword = async (e) => {
    e.preventDefault();
    if (!pwd.password || pwd.password.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }
    if (pwd.password !== pwd.password_confirmation) {
      toast.error("Passwords do not match");
      return;
    }
    setSavingPwd(true);
    try {
      const formData = new FormData();
      formData.append('_method', 'PATCH');
      if (pwd.current_password) {
        formData.append('current_password', pwd.current_password);
      }
      formData.append('password', pwd.password);
      formData.append('password_confirmation', pwd.password_confirmation);
      
      await api.post("/api/user", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      toast.success("Password updated");
      setPwd({ current_password: "", password: "", password_confirmation: "" });
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || "Password update failed";
      toast.error(msg);
    } finally {
      setSavingPwd(false);
    }
  };

  const togglePref = (key) => {
    setPrefs((p) => {
      const next = { ...p, [key]: !p[key] };
      localStorage.setItem(
        key === "email" ? "pref.notifications.email" : "pref.notifications.push",
        String(next[key])
      );
      toast.success(`${key === "email" ? "Email" : "Push"} notifications ${next[key] ? "enabled" : "disabled"}`);
      return next;
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
          <p className="text-sm text-gray-600 mt-1">Manage your account and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Profile Settings */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-3">
              <User className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-800">Profile Settings</h3>
            </div>
            <form onSubmit={saveProfile} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  name="name"
                  value={profile.name}
                  onChange={onProfileChange}
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  name="email"
                  value={profile.email}
                  onChange={onProfileChange}
                  type="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="you@email.com"
                />
              </div>
              <button type="submit" disabled={savingProfile} className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60">
                {savingProfile ? "Saving…" : "Save Changes"}
              </button>
            </form>
          </div>

          {/* Password Settings */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-3">
              <Lock className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-800">Change Password</h3>
            </div>
            <div className="p-6">
              {!showPwdForm ? (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">Click below to change your account password.</p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowPwdForm(true);
                        // when user chooses to show form, allow inputs to be editable
                        setPwdInputsReadonly(false);
                        setPwd({ current_password: "", password: "", password_confirmation: "" });
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
                    >
                      Change Password
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={updatePassword} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                    <input
                      type="password"
                      name="current_password"
                      value={pwd.current_password}
                      onChange={onPwdChange}
                      onFocus={() => setPwdInputsReadonly(false)}
                      readOnly={pwdInputsReadonly}
                      autoComplete="current-password"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="••••••••"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                      <input
                        type="password"
                        name="password"
                        value={pwd.password}
                        onChange={onPwdChange}
                        onFocus={() => setPwdInputsReadonly(false)}
                        readOnly={pwdInputsReadonly}
                        autoComplete="new-password"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="••••••••"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                      <input
                        type="password"
                        name="password_confirmation"
                        value={pwd.password_confirmation}
                        onChange={onPwdChange}
                        onFocus={() => setPwdInputsReadonly(false)}
                        readOnly={pwdInputsReadonly}
                        autoComplete="new-password"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button type="submit" disabled={savingPwd} className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60">
                      {savingPwd ? "Updating…" : "Update Password"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowPwdForm(false);
                        setPwd({ current_password: "", password: "", password_confirmation: "" });
                        setPwdInputsReadonly(true);
                      }}
                      className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Notification Settings */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-3">
              <Bell className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-800">Email Notifications</p>
                  <p className="text-sm text-gray-500">Receive updates via email</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={prefs.email}
                    onChange={() => togglePref("email")}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-800">Push Notifications</p>
                  <p className="text-sm text-gray-500">Browser push notifications</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={prefs.push}
                    onChange={() => togglePref("push")}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-3">
              <Shield className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-800">Security</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-800">Two-Factor Authentication</p>
                  <p className="text-sm text-gray-500">Add an extra layer of security</p>
                </div>
                <button
                  onClick={() => toast("2FA setup coming soon")}
                  className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Enable
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-800">Active Sessions</p>
                  <p className="text-sm text-gray-500">Manage your devices</p>
                </div>
                <button
                  onClick={() => toast("Session management coming soon")}
                  className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors"
                >
                  View All
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
