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
