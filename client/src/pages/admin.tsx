import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import AdminLogin from "@/components/admin/admin-login";
import AdminDashboard from "@/components/admin/admin-dashboard";
import { useAdminAuth } from "@/hooks/use-admin-auth";
import { withAdminAuth } from "@/components/admin/with-admin-auth";

// Protect the dashboard with authentication
const ProtectedAdminDashboard = withAdminAuth(AdminDashboard);

export default function AdminPage() {
  const [, setLocation] = useLocation();
  const { isAuthenticated, logout } = useAdminAuth();

  const handleLoginSuccess = () => {
    setLocation("/admin");
  };

  const handleLogout = () => {
    logout();
    setLocation("/admin/login");
  };

  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
  }

  return <ProtectedAdminDashboard onLogout={handleLogout} />;
}