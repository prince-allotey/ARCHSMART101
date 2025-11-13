import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function ProtectedRoute({ children, roles, redirectTo }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  // Not logged in - redirect to custom path or default to login
  if (!user) {
    return <Navigate to={redirectTo || "/login"} state={{ from: location }} replace />;
  }

  // Role-based access check
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Allowed
  return <>{children}</>;
}
