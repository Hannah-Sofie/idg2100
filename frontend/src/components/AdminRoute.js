import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Component to protect admin routes. It renders child routes if the user
 * is authenticated and has an admin role, otherwise redirects to an
 * unauthorized access page.
 */
const AdminRoute = () => {
  const { isAuthenticated, isAdmin } = useAuth(); // Use the custom hook to check auth state and admin status.

  return isAuthenticated && isAdmin ? (
    <Outlet /> // Renders child routes if conditions are met.
  ) : (
    <Navigate to="/unauthorized" /> // Redirects to the unauthorized page if not an admin or not authenticated.
  );
};

export default AdminRoute;
