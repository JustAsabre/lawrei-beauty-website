import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import AdminDashboard from "@/components/admin/admin-dashboard";
import { useAdminAuth } from "@/hooks/use-admin-auth";
import { withAdminAuth } from "@/components/admin/with-admin-auth";

// Protect the dashboard with authentication
const ProtectedAdminDashboard = withAdminAuth(AdminDashboard);

export default function AdminPage() {
  const [, setLocation] = useLocation();
  const { isAuthenticated, logout } = useAdminAuth();

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      setLocation("/admin/login");
    }
  }, [isAuthenticated, setLocation]);

  const handleLogout = () => {
    logout();
    setLocation("/admin/login");
  };

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return <ProtectedAdminDashboard onLogout={handleLogout} />;
}