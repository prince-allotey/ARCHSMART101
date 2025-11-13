import React, { useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { useNavigate, useSearchParams, useLocation, Link } from "react-router-dom";
import { User, Mail, Lock, Check, Home, Sparkles, Shield, UserCircle, Briefcase } from "lucide-react";

export default function SignupPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const defaultRole = searchParams.get("role");
  const from = location.state?.from?.pathname;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
    role: defaultRole === "agent" || defaultRole === "user" ? defaultRole : ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    if (formData.password !== formData.passwordConfirm) {
      setError("Passwords do not match");
      return;
    }

    if (!formData.role) {
      setError("Please select a role");
      return;
    }

    setLoading(true);
    try {
      await register(formData.name, formData.email, formData.password, formData.passwordConfirm, formData.role);
      // Note: register function in AuthContext handles navigation to appropriate dashboard
      // No need to navigate here - it's handled automatically
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: Home, text: "Access to premium properties" },
    { icon: Sparkles, text: "Smart home integration" },
    { icon: Shield, text: "Secure and verified listings" },
  ];

  return (
    <div className="min-h-screen flex items-center bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 shadow-2xl rounded-3xl overflow-hidden bg-white my-8">
        
        {/* Left Side - Branding */}
        <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Home className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold">ArchSmartGH</h1>
                <p className="text-blue-100 text-sm">Smart Living Solutions</p>
              </div>
            </div>
            
            <h2 className="text-4xl font-bold mb-4">Join Our Community</h2>
            <p className="text-blue-100 text-lg mb-8">
              Discover your dream property and experience smart living at its finest.
            </p>

            <div className="space-y-4">
              {features.map((feature, idx) => {
                const Icon = feature.icon;
                return (
                  <div key={idx} className="flex items-center gap-3 bg-white/10 backdrop-blur-sm p-4 rounded-xl">
                    <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <p className="text-white/90">{feature.text}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="text-blue-100 text-sm">
            © 2025 ArchSmartGH. All rights reserved.
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center">
          {from === "/education" && (
            <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-600 rounded-lg">
              <p className="text-blue-800 font-semibold text-sm">
                📚 Sign up to access Education resources
              </p>
              <p className="text-blue-600 text-xs mt-1">
                Already have an account? <Link to="/login" className="underline font-semibold">Login here</Link>
              </p>
            </div>
          )}

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h2>
            <p className="text-gray-600">Join us and start your property journey today</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                  required
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  name="passwordConfirm"
                  value={formData.passwordConfirm}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                  required
                />
              </div>
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">I am a...</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: "user" })}
                  className={`relative p-4 rounded-xl border-2 transition-all ${
                    formData.role === "user"
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <UserCircle className={`w-8 h-8 mx-auto mb-2 ${formData.role === "user" ? "text-blue-600" : "text-gray-400"}`} />
                  <p className={`font-semibold text-sm ${formData.role === "user" ? "text-blue-600" : "text-gray-700"}`}>User</p>
                  <p className="text-xs text-gray-500 mt-1">Looking for properties</p>
                  {formData.role === "user" && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: "agent" })}
                  className={`relative p-4 rounded-xl border-2 transition-all ${
                    formData.role === "agent"
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <Briefcase className={`w-8 h-8 mx-auto mb-2 ${formData.role === "agent" ? "text-blue-600" : "text-gray-400"}`} />
                  <p className={`font-semibold text-sm ${formData.role === "agent" ? "text-blue-600" : "text-gray-700"}`}>Agent</p>
                  <p className="text-xs text-gray-500 mt-1">Selling properties</p>
                  {formData.role === "agent" && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>

            {/* Login Link */}
            <p className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600 font-semibold hover:underline">
                Login here
              </Link>
            </p>
          </form>

          {/* Mobile Branding */}
          <div className="lg:hidden mt-8 pt-8 border-t border-gray-200">
            <div className="text-center text-gray-500 text-xs">
              © 2025 ArchSmartGH. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
