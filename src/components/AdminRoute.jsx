import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminRoute({ children }) {
  const { user } = useAuth();

  // Not logged in
  if (!user) return <Navigate to="/login" replace />;

  // Logged in but not admin
  if (user.role !== "ROLE_ADMIN") return <Navigate to="/" replace />;

  // Allowed → render component
  return children;
}
