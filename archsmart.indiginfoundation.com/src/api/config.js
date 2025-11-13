// src/api/config.js

// Derive sensible runtime defaults when env vars are missing (e.g., on cPanel)
const inferBackendOrigin = () => {
  const envUrl = import.meta.env.VITE_BACKEND_URL;
  if (envUrl) return envUrl;
  if (typeof window !== 'undefined') {
    const { protocol } = window.location;
    const host = window.location.host;
    // If frontend is archsmart.indiginfoundation.com, backend is archsmartadm.indiginfoundation.com
    if (/archsmart\.indiginfoundation\.com$/i.test(host)) {
      return `${protocol}//archsmartadm.indiginfoundation.com`;
    }
  }
  return "http://localhost:8000";
};

// ✅ Full backend origin (for CSRF, cookies, etc.)
export const BACKEND_ORIGIN = inferBackendOrigin();

// ✅ Base URL for your Laravel backend API
export const API_BASE_URL = (import.meta.env.VITE_API_URL) || `${BACKEND_ORIGIN}/api`;

// ✅ API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    USER: "/auth/user",
  },
  PROPERTIES: {
    LIST: "/properties",
    CREATE: "/properties",
    UPDATE: (id) => `/properties/${id}`,
    DELETE: (id) => `/properties/${id}`,
  },
  BLOGS: {
    LIST: "/blog-posts",
    CREATE: "/blog-posts",
    UPDATE: (id) => `/blog-posts/${id}`,
    DELETE: (id) => `/blog-posts/${id}`,
  },
};
