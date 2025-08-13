import { useState } from "react";
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
  BarChart3
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AdminBookings from "./admin-bookings";
import AdminContacts from "./admin-contacts";
import AdminPortfolio from "./admin-portfolio";
import AdminSettings from "./admin-settings";

interface AdminDashboardProps {
  onLogout: () => void;
}

type AdminView = "overview" | "bookings" | "contacts" | "portfolio" | "settings";

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [currentView, setCurrentView] = useState<AdminView>("overview");
  const { toast } = useToast();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    onLogout();
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  const stats = [
    { title: "Total Bookings", value: "24", icon: Calendar, color: "text-blue-400" },
    { title: "New Messages", value: "8", icon: MessageSquare, color: "text-green-400" },
    { title: "Portfolio Items", value: "12", icon: Image, color: "text-purple-400" },
    { title: "Total Clients", value: "156", icon: Users, color: "text-orange-400" }
  ];

  const renderView = () => {
    switch (currentView) {
      case "bookings":
        return <AdminBookings />;
      case "contacts":
        return <AdminContacts />;
      case "portfolio":
        return <AdminPortfolio />;
      case "settings":
        return <AdminSettings />;
      default:
        return (
          <div className="space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat) => {
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
              })}
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
                  <div className="flex items-center space-x-3 p-3 bg-black/30 rounded-lg">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-sm text-gray-300">New booking from Sarah J.</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-black/30 rounded-lg">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-sm text-gray-300">Portfolio item updated</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-black/30 rounded-lg">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                    <span className="text-sm text-gray-300">New contact message</span>
                  </div>
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
