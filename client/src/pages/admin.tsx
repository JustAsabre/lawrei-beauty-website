import { useState, useEffect } from "react";
import AdminLogin from "@/components/admin/admin-login";
import AdminDashboard from "@/components/admin/admin-dashboard";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminToken, setAdminToken] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      setAdminToken(token);
      setIsAuthenticated(true);
    }
  }, []);

  const handleLoginSuccess = (token: string) => {
    setAdminToken(token);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setAdminToken(null);
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
  }

  return <AdminDashboard onLogout={handleLogout} />;
}
