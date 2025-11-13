import React, { useMemo, useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { Link, useSearchParams } from "react-router-dom";
import { User2, BadgeCheck, Mail, Lock } from "lucide-react";

export default function Login() {
  const { login } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialMode = useMemo(() => {
    const m = (searchParams.get("mode") || "user").toLowerCase();
    return m === "agent" ? "agent" : "user";
  }, [searchParams]);
  const [mode, setMode] = useState(initialMode); // "user" | "agent"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
      // Navigation is handled in AuthContext based on actual role
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center bg-gradient-to-br from-sky-50 via-white to-emerald-50">
      <div className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 shadow-xl rounded-3xl overflow-hidden bg-white">
        {/* Brand / Illustration */}
        <div className="hidden md:flex flex-col justify-between p-10 bg-gradient-to-br from-blue-600 via-indigo-600 to-emerald-600 text-white">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Welcome back</h1>
            <p className="mt-2 text-blue-100">Sign in to manage properties, track progress, and explore smart living.</p>
          </div>
          <div className="mt-10 space-y-4">
            <div className="flex items-center gap-3">
              <BadgeCheck className="w-6 h-6" />
              <p>Secure authentication</p>
            </div>
            <div className="flex items-center gap-3">
              <User2 className="w-6 h-6" />
              <p>Agents and users in one place</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="p-8 md:p-12">
          {/* Switcher */}
          <div className="flex items-center bg-gray-100 rounded-xl p-1 w-max mb-8">
            <button
              onClick={() => { setMode("user"); setSearchParams({ mode: "user" }, { replace: true }); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${mode === "user" ? "bg-white shadow text-gray-900" : "text-gray-600"}`}
            >
              User
            </button>
            <button
              onClick={() => { setMode("agent"); setSearchParams({ mode: "agent" }, { replace: true }); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${mode === "agent" ? "bg-white shadow text-gray-900" : "text-gray-600"}`}
            >
              Agent
            </button>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            {mode === "agent" ? "Agent Login" : "Login to your account"}
          </h2>
          <p className="text-gray-500 mt-1 mb-6">
            {mode === "agent" ? "Access your agent dashboard and manage properties." : "Welcome back! Please enter your details."}
          </p>

          {error && (
            <div className="mb-4 rounded-lg bg-red-50 text-red-700 px-4 py-2 text-sm">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <div className="mt-1 relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <div className="mt-1 relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="text-gray-600">
                New here? {" "}
                <Link to={`/signup?role=${mode}`} className="text-blue-600 hover:underline">Create an account</Link>
              </div>
              <Link to="/forgotpassword" className="text-blue-600 hover:underline">Forgot password?</Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 text-white py-3 rounded-xl font-semibold hover:opacity-95 transition disabled:opacity-60"
            >
              {loading ? "Signing in…" : mode === "agent" ? "Sign in as Agent" : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
