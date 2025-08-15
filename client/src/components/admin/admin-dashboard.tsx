import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  Calendar, 
  MessageSquare, 
  Image, 
  Settings, 
  LogOut, 
  Plus,
  Eye,
  Edit,
  Trash2,
  BarChart3,
  Wrench,
  Star,
  FileText
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AdminBookings from "./admin-bookings";
import AdminContacts from "./admin-contacts";
import AdminPortfolio from "./admin-portfolio";
import AdminSettings from "./admin-settings";
import AdminServices from "./admin-services";
import AdminTestimonials from "./admin-testimonials";
import AdminContent from "./admin-content";

interface AdminDashboardProps {
  onLogout: () => void;
}

type AdminView = "overview" | "bookings" | "contacts" | "portfolio" | "services" | "testimonials" | "content" | "settings";

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [currentView, setCurrentView] = useState<AdminView>("overview");
  const [stats, setStats] = useState({
    totalBookings: 0,
    newMessages: 0,
    portfolioItems: 0,
    totalClients: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Fetch real statistics from backend
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        if (!token) return;

        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'https://lawrei-beauty-website.onrender.com'}/admin/stats`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          setStats(data);
        } else {
          console.error('Failed to fetch stats');
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    onLogout();
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  const statsData = [
    { title: "Total Bookings", value: stats.totalBookings.toString(), icon: Calendar, color: "text-blue-400" },
    { title: "New Messages", value: stats.newMessages.toString(), icon: MessageSquare, color: "text-green-400" },
    { title: "Portfolio Items", value: stats.portfolioItems.toString(), icon: Image, color: "text-purple-400" },
    { title: "Total Clients", value: stats.totalClients.toString(), icon: Users, color: "text-orange-400" }
  ];

  const renderView = () => {
    switch (currentView) {
      case "bookings":
        return <AdminBookings />;
      case "contacts":
        return <AdminContacts />;
      case "portfolio":
        return <AdminPortfolio />;
      case "services":
        return <AdminServices />;
      case "testimonials":
        return <AdminTestimonials />;
      case "content":
        return <AdminContent />;
      case "settings":
        return <AdminSettings />;
      default:
        return (
          <div className="space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {isLoading ? (
                // Loading skeleton
                Array.from({ length: 4 }).map((_, i) => (
                  <Card key={i} className="glass-morphism border-gray-600">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="space-y-2">
                          <div className="h-4 bg-gray-600 rounded w-20"></div>
                          <div className="h-8 bg-gray-600 rounded w-16"></div>
                        </div>
                        <div className="w-8 h-8 bg-gray-600 rounded"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                statsData.map((stat) => {
                  const IconComponent = stat.icon;
                  return (
                    <Card key={stat.title} className="glass-morphism border-gray-600">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-400">{stat.title}</p>
                            <p className="text-2xl font-bold text-white">{stat.value}</p>
                          </div>
                          <IconComponent className={`w-8 h-8 ${stat.color}`} />
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="glass-morphism border-gray-600">
                <CardHeader>
                  <CardTitle className="text-white">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    onClick={() => setCurrentView("portfolio")}
                    className="w-full justify-start bg-gradient-to-r from-luxury-gold to-soft-pink text-black hover:opacity-90"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Portfolio Item
                  </Button>
                  <Button 
                    onClick={() => setCurrentView("bookings")}
                    variant="outline"
                    className="w-full justify-start glass-morphism border-gray-600 hover:bg-luxury-gold hover:text-black"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    View Bookings
                  </Button>
                  <Button 
                    onClick={() => setCurrentView("contacts")}
                    variant="outline"
                    className="w-full justify-start glass-morphism border-gray-600 hover:bg-luxury-gold hover:text-black"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Check Messages
                  </Button>
                </CardContent>
              </Card>

              <Card className="glass-morphism border-gray-600">
                <CardHeader>
                  <CardTitle className="text-white">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {stats.newMessages > 0 && (
                    <div className="flex items-center space-x-3 p-3 bg-black/30 rounded-lg">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-sm text-gray-300">{stats.newMessages} new message{stats.newMessages > 1 ? 's' : ''} received</span>
                    </div>
                  )}
                  {stats.totalBookings > 0 && (
                    <div className="flex items-center space-x-3 p-3 bg-black/30 rounded-lg">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span className="text-sm text-gray-300">{stats.totalBookings} active booking{stats.totalBookings > 1 ? 's' : ''}</span>
                    </div>
                  )}
                  {stats.portfolioItems > 0 && (
                    <div className="flex items-center space-x-3 p-3 bg-black/30 rounded-lg">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                      <span className="text-sm text-gray-300">{stats.portfolioItems} portfolio item{stats.portfolioItems > 1 ? 's' : ''} available</span>
                    </div>
                  )}
                  {stats.totalClients > 0 && (
                    <div className="flex items-center space-x-3 p-3 bg-black/30 rounded-lg">
                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                      <span className="text-sm text-gray-300">{stats.totalClients} client{stats.totalClients > 1 ? 's' : ''} in database</span>
                    </div>
                  )}
                  {!isLoading && stats.totalBookings === 0 && stats.newMessages === 0 && (
                    <div className="text-center text-gray-400 py-4">
                      <p className="text-sm">No recent activity</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-rich-black to-black">
      {/* Header */}
      <header className="bg-black/50 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-display font-bold gradient-text">
                LawreiBeauty Admin
              </h1>
              <div className="hidden md:flex items-center space-x-1 text-sm text-gray-400">
                <span>•</span>
                <span>Dashboard</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="glass-morphism border-gray-600 hover:bg-red-600 hover:border-red-600"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-black/30 backdrop-blur-md border-r border-gray-800 min-h-screen">
          <nav className="p-6">
            <div className="space-y-2">
              <Button
                variant={currentView === "overview" ? "default" : "ghost"}
                className={`w-full justify-start ${
                  currentView === "overview" 
                    ? "bg-gradient-to-r from-luxury-gold to-soft-pink text-black" 
                    : "text-gray-300 hover:bg-luxury-gold hover:text-black"
                }`}
                onClick={() => setCurrentView("overview")}
              >
                <BarChart3 className="w-4 h-4 mr-3" />
                Overview
              </Button>
              
              <Button
                variant={currentView === "bookings" ? "default" : "ghost"}
                className={`w-full justify-start ${
                  currentView === "bookings" 
                    ? "bg-gradient-to-r from-luxury-gold to-soft-pink text-black" 
                    : "text-gray-300 hover:bg-luxury-gold hover:text-black"
                }`}
                onClick={() => setCurrentView("bookings")}
              >
                <Calendar className="w-4 h-4 mr-3" />
                Bookings
              </Button>
              
              <Button
                variant={currentView === "contacts" ? "default" : "ghost"}
                className={`w-full justify-start ${
                  currentView === "contacts" 
                    ? "bg-gradient-to-r from-luxury-gold to-soft-pink text-black" 
                    : "text-gray-300 hover:bg-luxury-gold hover:text-black"
                }`}
                onClick={() => setCurrentView("contacts")}
              >
                <MessageSquare className="w-4 h-4 mr-3" />
                Messages
              </Button>
              
              <Button
                variant={currentView === "portfolio" ? "default" : "ghost"}
                className={`w-full justify-start ${
                  currentView === "portfolio" 
                    ? "bg-gradient-to-r from-luxury-gold to-soft-pink text-black" 
                    : "text-gray-300 hover:bg-luxury-gold hover:text-black"
                }`}
                onClick={() => setCurrentView("portfolio")}
              >
                <Image className="w-4 h-4 mr-3" />
                Portfolio
              </Button>
              
              <Button
                variant={currentView === "services" ? "default" : "ghost"}
                className={`w-full justify-start ${
                  currentView === "services" 
                    ? "bg-gradient-to-r from-luxury-gold to-soft-pink text-black" 
                    : "text-gray-300 hover:bg-luxury-gold hover:text-black"
                }`}
                onClick={() => setCurrentView("services")}
              >
                <Wrench className="w-4 h-4 mr-3" />
                Services
              </Button>
              
              <Button
                variant={currentView === "testimonials" ? "default" : "ghost"}
                className={`w-full justify-start ${
                  currentView === "testimonials" 
                    ? "bg-gradient-to-r from-luxury-gold to-soft-pink text-black" 
                    : "text-gray-300 hover:bg-luxury-gold hover:text-black"
                }`}
                onClick={() => setCurrentView("testimonials")}
              >
                <Star className="w-4 h-4 mr-3" />
                Testimonials
              </Button>
              
              <Button
                variant={currentView === "content" ? "default" : "ghost"}
                className={`w-full justify-start ${
                  currentView === "content" 
                    ? "bg-gradient-to-r from-luxury-gold to-soft-pink text-black" 
                    : "text-gray-300 hover:bg-luxury-gold hover:text-black"
                }`}
                onClick={() => setCurrentView("content")}
              >
                <FileText className="w-4 h-4 mr-3" />
                Site Content
              </Button>
              
              <Button
                variant={currentView === "settings" ? "default" : "ghost"}
                className={`w-full justify-start ${
                  currentView === "settings" 
                    ? "bg-gradient-to-r from-luxury-gold to-soft-pink text-black" 
                    : "text-gray-300 hover:bg-luxury-gold hover:text-black"
                }`}
                onClick={() => setCurrentView("settings")}
              >
                <Settings className="w-4 h-4 mr-3" />
                Settings
              </Button>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {renderView()}
          </div>
        </main>
      </div>
    </div>
  );
}
