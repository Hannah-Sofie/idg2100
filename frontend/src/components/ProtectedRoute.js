import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Component to protect routes that require authentication.
 * Renders child routes if the user is authenticated, otherwise
 * redirects to the login page.
 */
const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth(); // Use the custom hook to check the authentication status.

  return isAuthenticated ? (
    <Outlet /> // Renders child routes if the user is authenticated.
  ) : (
    <Navigate to="/login" /> // Redirects to the login page if not authenticated.
  );
};

export default ProtectedRoute;
