import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api, { ensureCsrf } from "../../../api/axios";

export default function ResetPassword() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const token = params.get("token") || "";
  const email = params.get("email") || "";

  const [formData, setFormData] = useState({
    email,
    token,
    password: "",
    password_confirmation: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      await ensureCsrf();
  // Correct API path (backend defines POST /api/reset-password)
  const { data } = await api.post("/api/reset-password", formData);
  setMessage(data.message);
  // Shorter redirect delay so user isn't kept waiting unnecessarily.
  setTimeout(() => navigate("/login"), 800);
    } catch (err) {
      setError(err.response?.data?.message || "Password reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Reset Your Password</h2>
        {message && (<p className="text-green-600 text-sm mb-4 text-center">{message}</p>)}
        {error && (<p className="text-red-600 text-sm mb-4 text-center">{error}</p>)}
        <input type="password" name="password" placeholder="New Password" value={formData.password} onChange={handleChange} required className="w-full p-3 mb-3 border rounded-lg" />
        <input type="password" name="password_confirmation" placeholder="Confirm Password" value={formData.password_confirmation} onChange={handleChange} required className="w-full p-3 mb-4 border rounded-lg" />
        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition">{loading ? "Resetting..." : "Reset Password"}</button>
      </form>
    </div>
  );
}
