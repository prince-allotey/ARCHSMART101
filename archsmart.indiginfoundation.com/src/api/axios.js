// src/api/axios.js
import axios from "axios";
import { BACKEND_ORIGIN } from "./config";

// ✅ Create main Axios instance (use env-configured backend origin)
const api = axios.create({
  baseURL: BACKEND_ORIGIN,
  headers: {
    Accept: "application/json",
  },
});

// If you want to use Sanctum's cookie-based auth flow, enable credentials
// so the browser will send and accept cookies from the API domain.
// You can toggle this at runtime if you support both flows.
api.defaults.withCredentials = true;

// ✅ Helper: Ensure CSRF cookie is set (required before login/register)
export const ensureCsrf = async () => {
  try {
    // For Sanctum cookie-based auth, the client must hit the csrf-cookie
    // endpoint first which sets the XSRF-TOKEN cookie. Axios will then
    // include the X-XSRF-TOKEN header on subsequent requests.
    await api.get('/sanctum/csrf-cookie');
  } catch (error) {
    console.error("Failed to get CSRF cookie:", error);
  }
};

// ✅ Request interceptor — attach Bearer token if available
api.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Central sanitizer: if we're sending FormData, remove empty password fields
    try {
      const fd = config.data;
      if (fd && typeof FormData !== 'undefined' && fd instanceof FormData) {
        // Only delete password fields when they are absent/empty (null/undefined/empty string).
        // Do NOT touch file fields or other keys.
        const pwd = fd.get('password');
        const pwdc = fd.get('password_confirmation');

        const isEmpty = (v) => v === null || v === undefined || (typeof v === 'string' && v.trim() === '');

        if (isEmpty(pwd) && (pwdc === null || pwdc === undefined || isEmpty(pwdc))) {
          // remove both if password is empty — avoids server-side "confirmed" validation when user didn't change password
          fd.delete('password');
          fd.delete('password_confirmation');
        } else if (isEmpty(pwd) && !isEmpty(pwdc)) {
          // If confirmation exists but password is empty, remove confirmation to avoid mismatch errors
          fd.delete('password_confirmation');
        }

        // Local debug: enumerate but avoid logging in production; guard for environments without window
        try {
          if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
            for (const e of fd.entries()) console.debug('[axios FormData] ', e[0], e[1]);
          }
        } catch (e) {
          // ignore
        }
      }
    } catch (err) {
      // ignore sanitizer errors — don't break requests because of logging
      try { console.warn('FormData sanitizer error', err); } catch (e) {}
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Optional Response Interceptor
api.interceptors.response.use(
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

export default api;
