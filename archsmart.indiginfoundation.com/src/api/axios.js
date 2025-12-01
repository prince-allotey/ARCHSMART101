// src/api/axios.js
import axios from "axios";
import { BACKEND_ORIGIN, API_ENDPOINTS } from "./config";

// ✅ Main Axios instance
const API = axios.create({
  baseURL: BACKEND_ORIGIN,
  headers: { Accept: "application/json" },
  withCredentials: false, // Using Bearer tokens only; no cookies
});

// ✅ CSRF cookie helper (Sanctum)
export const ensureCsrf = async () => {
  // Not needed for Bearer token auth; kept as a no-op
  return Promise.resolve();
};

// ✅ Request interceptor — attach Bearer token if present & sanitize FormData
API.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;

    const fd = config.data;
    if (fd && typeof FormData !== "undefined" && fd instanceof FormData) {
      const isEmpty = (v) => v === null || v === undefined || (typeof v === "string" && v.trim() === "");
      const pwd = fd.get("password");
      const pwdc = fd.get("password_confirmation");

      if (isEmpty(pwd) && (pwdc === null || pwdc === undefined || isEmpty(pwdc))) {
        fd.delete("password");
        fd.delete("password_confirmation");
      } else if (isEmpty(pwd) && !isEmpty(pwdc)) {
        fd.delete("password_confirmation");
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response interceptor — handle 401
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized — redirecting to login");
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// ==========================
// Auth API
// ==========================
export const authApi = {
  login: (data) => API.post("/login", data),
  register: (data) => API.post("/register", data),
  logout: () => API.post("/logout"),
  user: () => API.get("/user"),
  updateProfile: (data) => API.patch("/user", data),
  forgotPassword: (data) => API.post("/forgot-password", data),
  resetPassword: (data) => API.post("/reset-password", data),
};

// ==========================
// Properties API
// ==========================
export const propertyApi = {
  list: () => API.get("/properties"),
  approved: () => API.get("/properties/approved"),
  featured: () => API.get("/properties/featured"),
  byAgent: (agentId) => API.get(`/properties/agent/${agentId}`),
  myProperties: () => API.get("/properties/my"),
  view: (id) => API.get(`/properties/${id}/view`),
  show: (id) => API.get(`/properties/${id}`),
  create: (data) => API.post("/properties", data),
  update: (id, data) => API.put(`/properties/${id}`, data),
  delete: (id) => API.delete(`/properties/${id}`),
  approve: (id) => API.post(`/properties/${id}/approve`),
  reject: (id) => API.post(`/properties/${id}/reject`),
  pending: () => API.get("/properties/pending"),
};

// ==========================
// Blog API
// ==========================
export const blogApi = {
  list: () => API.get("/blog-posts"),
  show: (slug) => API.get(`/blog-posts/${slug}`),
  create: (data) => API.post("/blog-posts", data),
  update: (id, data) => API.put(`/blog-posts/${id}`, data),
  delete: (id) => API.delete(`/blog-posts/${id}`),
  comments: (postId) => API.get(`/posts/${postId}/comments`),
  addComment: (postId, data) => API.post(`/posts/${postId}/comments`, data),
};

// ==========================
// Tags
// ==========================
export const tagApi = {
  list: () => API.get("/tags"),
};

// ==========================
// Drafts
// ==========================
export const draftApi = {
  store: (data) => API.post("/drafts", data),
  show: (id) => API.get(`/drafts/${id}`),
};

// ==========================
// Push Notifications
// ==========================
export const pushApi = {
  publicKey: () => API.get("/push/public-key"),
  subscribe: (data) => API.post("/push/subscribe", data),
  unsubscribe: (data) => API.delete("/push/unsubscribe", { data }),
  test: (data) => API.post("/push/test", data),
  broadcast: (data) => API.post("/push/broadcast", data),
  notifications: () => API.get("/notifications"),
  unreadCount: () => API.get("/notifications/unread-count"),
  markRead: (id) => API.post(`/notifications/${id}/read`),
  markAllRead: () => API.post("/notifications/read-all"),
};

// ==========================
// Inquiries
// ==========================
export const inquiryApi = {
  create: (data) => API.post("/inquiries", data),
  list: () => API.get("/inquiries"),
  statistics: () => API.get("/inquiries/statistics"),
  show: (id) => API.get(`/inquiries/${id}`),
  update: (id, data) => API.put(`/inquiries/${id}`, data),
  delete: (id) => API.delete(`/inquiries/${id}`),
};

// ==========================
// Consultations
// ==========================
export const consultationApi = {
  list: () => API.get("/consultations"),
  respond: (id, data) => API.put(`/consultations/${id}`, data),
  create: (data) => API.post("/consultations", data),
};

// ==========================
// Admin / Image Repair
// ==========================
export const adminApi = {
  agents: () => API.get("/admin/agents"),
  pendingAgents: () => API.get("/admin/agents/pending"),
  approveAgent: (id) => API.post(`/admin/agents/${id}/approve`),
  suspendAgent: (id) => API.post(`/admin/agents/${id}/suspend`),
  blogPosts: () => API.get("/admin/blog-posts"),
  missingMedia: () => API.get("/admin/missing-media"),
  repairMissing: (type, id) => API.post(`/admin/repair-missing-media/${type}/${id}`),
};

// ==========================
// Export default
// ==========================
export default API;
