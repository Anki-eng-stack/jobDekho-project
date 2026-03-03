// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, roles, role }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  // Not logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If roles prop is provided, check if user's role is allowed
  const allowedRoles = roles || role;
  if (allowedRoles) {
    // Normalize roles to an array
    const allowed = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
    if (!allowed.includes(userRole)) {
      return <Navigate to="/" replace />;
    }
  }

  // Everything is OK
  return children;
};

export default ProtectedRoute;
