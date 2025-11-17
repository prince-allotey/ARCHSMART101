// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api, { ensureCsrf } from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Restore session on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          // No session token; ensure loading state clears
          setUser(null);
          setLoading(false);
          return;
        }

        const res = await api.get("/api/user");
        setUser(res.data);
      } catch {
        setUser(null);
      } finally {
        // In the no-token branch, loading is already cleared; guard double set
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const login = async (email, password) => {
    try {
      // Ensure CSRF cookie is set for stateful (Sanctum) flows. Harmless for token flows.
      try { await ensureCsrf(); } catch (e) { /* ignore */ }
      const res = await api.post("/api/login", { email, password });
      const { token, user: userData } = res.data;
      if (token) localStorage.setItem("token", token);
      // api axios instance will attach Authorization header from localStorage via interceptor
      setUser(userData);

  if (userData.role === "admin") navigate("/dashboard");
  else if (userData.role === "agent") navigate("/agent/dashboard");
  else navigate("/user/dashboard");
    } catch (err) {
      // Better logging for network / server errors and surface validation messages
      console.error("Login error:", err);
      const resp = err?.response;
      if (resp) {
        // Validation errors from Laravel are in resp.data.errors or resp.data
        if (resp.status === 422) {
          const data = resp.data || {};
          const errMessages = [];
          if (data.errors) {
            for (const k of Object.keys(data.errors)) {
              errMessages.push(...data.errors[k]);
            }
          }
          if (data.message) errMessages.unshift(data.message);
          const msg = errMessages.length ? errMessages.join(" \n") : (data.message || 'Validation failed');
          throw new Error(msg);
        }
        const message = resp.data?.message || resp.statusText || err.message;
        throw new Error(message);
      }
      throw new Error(err?.message || 'Login failed');
    }
  };

  const register = async (name, email, password, passwordConfirm, role) => {
    try {
      // Ensure CSRF cookie is set for Sanctum stateful flows (harmless for token flows)
      try { await ensureCsrf(); } catch (e) { /* ignore */ }

      const res = await api.post("/api/register", {
        name,
        email,
        password,
        password_confirmation: passwordConfirm,
        role,
      });

      const { token, user: userData } = res.data;
      if (token) localStorage.setItem("token", token);
      setUser(userData);

  if (userData.role === "admin") navigate("/dashboard");
  else if (userData.role === "agent") navigate("/agent/dashboard");
  else navigate("/user/dashboard");

      // Attempt push subscription after successful login (non-blocking)
      try { await registerPush(); } catch (e) { console.warn('Push registration failed:', e?.message || e); }
    } catch (err) {
      console.error("Register error:", err);
      const message = err?.response?.data?.message || err?.message || "Signup failed";
      throw new Error(message);
    }
  };

  const logout = async () => {
    try {
      await api.post("/api/logout");
      localStorage.removeItem("token");
      setUser(null);
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const refreshUser = async () => {
    try {
      const res = await api.get("/api/user");
      setUser(res.data);
    } catch (err) {
      console.error("Failed to refresh user:", err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, refreshUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to access auth
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

// Helper: register service worker + subscribe
async function registerPush() {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;
  // Ensure service worker
  const reg = await navigator.serviceWorker.register('/sw.js');
  await navigator.serviceWorker.ready;

  // Fetch VAPID public key
  const resp = await api.get('/api/push/public-key');
  const { key } = resp.data || {};
  if (!key) throw new Error('Missing VAPID public key');
  const convertedKey = urlBase64ToUint8Array(key);

  // Check existing subscription
  let sub = await reg.pushManager.getSubscription();
  if (!sub) {
    sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: convertedKey });
  }

  // Send to backend
  await api.post('/api/push/subscribe', sub);
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
