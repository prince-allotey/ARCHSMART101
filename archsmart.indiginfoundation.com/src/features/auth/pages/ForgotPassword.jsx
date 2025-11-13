import { useState } from "react";
import api, { ensureCsrf } from "../../../api/axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      await ensureCsrf();
  // Correct API path (backend defines POST /api/forgot-password)
  const { data } = await api.post("/api/forgot-password", { email });
      setMessage(data.message);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send reset link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Forgot Your Password?</h2>
        {message && (<p className="text-green-600 text-sm mb-4 text-center">{message}</p>)}
        {error && (<p className="text-red-600 text-sm mb-4 text-center">{error}</p>)}
        <input type="email" placeholder="Enter your registered email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full p-3 mb-4 border rounded-lg" />
        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition">{loading ? "Sending..." : "Send Reset Link"}</button>
        <p className="mt-4 text-center text-gray-600 text-sm">Remembered your password? <a href="/login" className="text-blue-600 hover:underline">Back to Login</a></p>
      </form>
    </div>
  );
}
