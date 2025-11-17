import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Menu, X, Home, Sparkles, GraduationCap, BookOpen, LogIn, UserPlus, LayoutDashboard } from "lucide-react";

export default function Header({ activeSection, onSectionChange }) {
  const navigate = useNavigate();
  // Guard useAuth call so HMR won't crash when provider is briefly unavailable.
  let _auth;
  try {
    _auth = useAuth();
  } catch (e) {
    _auth = { user: null, logout: () => {} };
  }
  const { user, logout } = _auth;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: "Home", section: "home", path: "/", icon: Home },
    { label: "Properties", section: "properties", path: "/properties", icon: Home },
    { label: "Smart Living", section: "smart-living", path: "/smart-living", icon: Sparkles },
    { label: "Education", section: "education", path: "/education", icon: GraduationCap },
    { label: "Blog", section: "blog", path: "/blog", icon: BookOpen },
  ];

  const handleNavigate = (section, path) => {
    onSectionChange(section);
    navigate(path);
    setIsMenuOpen(false);
  };

  const handleDashboardClick = () => {
    if (!user) return navigate("/login");
    if (user.role === "admin") return navigate("/dashboard");
    if (user.role === "agent") return navigate("/agent/dashboard");
    // Default user route
    navigate("/user/dashboard");
  };

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-white shadow-lg' 
        : 'bg-white shadow-md'
    }`}>
      <div className="container mx-auto px-3 sm:px-4 md:px-8">
        <div className="flex items-center justify-between py-3 sm:py-4">
          {/* Logo */}
          <div
            className="flex items-center gap-1.5 sm:gap-2 cursor-pointer group"
            onClick={() => handleNavigate("home", "/")}
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center transition-all group-hover:scale-110 shadow-md flex-shrink-0">
              <Home className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-base sm:text-xl md:text-2xl font-extrabold tracking-tight whitespace-nowrap">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">ArchSmart</span>
                <span className="text-gray-700 ml-0.5 sm:ml-1">GH</span>
              </h1>
              <p className="text-[8px] sm:text-[10px] -mt-0.5 sm:-mt-1 text-gray-600 whitespace-nowrap">
                Smart Living Solutions
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.section}
                  onClick={() => handleNavigate(item.section, item.path)}
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 group ${
                    activeSection === item.section
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  {item.label}
                  {activeSection === item.section && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 rounded-full bg-blue-600"></span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <button
                  onClick={handleDashboardClick}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  {user.role === "admin"
                    ? "Admin"
                    : user.role === "agent"
                    ? "My Dashboard"
                    : "Dashboard"}
                </button>
                <button
                  onClick={logout}
                  className="px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 border-2 border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center gap-2 border-2 border-blue-600 text-blue-600 hover:bg-blue-50"
                >
                  <LogIn className="w-4 h-4" />
                  Login
                </button>
                <button
                  onClick={() => navigate("/signup")}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700"
                >
                  <UserPlus className="w-4 h-4" />
                  Sign Up
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-1.5 sm:p-2 rounded-lg sm:rounded-xl transition-all text-gray-700 hover:bg-gray-100 flex-shrink-0"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-2xl border-t border-gray-100 animate-fadeIn">
          <nav className="flex flex-col p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.section}
                  onClick={() => handleNavigate(item.section, item.path)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    activeSection === item.section
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </button>
              );
            })}

            <div className="h-px bg-gray-200 my-2"></div>

            {user ? (
              <>
                <button
                  onClick={() => {
                    handleDashboardClick();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-sm font-semibold"
                >
                  <LayoutDashboard className="w-5 h-5" />
                  {user.role === "admin"
                    ? "Admin Dashboard"
                    : user.role === "agent"
                    ? "My Dashboard"
                    : "Dashboard"}
                </button>
                <button
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    navigate("/login");
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center gap-3 px-4 py-3 border-2 border-blue-600 text-blue-600 rounded-lg text-sm font-semibold"
                >
                  <LogIn className="w-5 h-5" />
                  Login
                </button>
                <button
                  onClick={() => {
                    navigate("/signup");
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-sm font-semibold"
                >
                  <UserPlus className="w-5 h-5" />
                  Sign Up
                </button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
