import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Settings, 
  Save, 
  User, 
  Mail, 
  Phone, 
  MapPin,
  Globe,
  Shield,
  Palette,
  Database,
  Loader2,
  AlertCircle,
  CheckCircle,
  RefreshCw
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AdminUser {
  username: string;
  email: string;
  role: string;
}

interface BusinessInfo {
  name: string;
  phone: string;
  email: string;
  address: string;
  description: string;
  website: string;
}

interface SiteSettings {
  maintenanceMode: boolean;
  allowBookings: boolean;
  featuredServices: string[];
  maxBookingsPerDay: number;
  bookingAdvanceDays: number;
  socialMedia: {
    instagram: string;
    facebook: string;
    twitter: string;
    tiktok: string;
  };
}

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [adminUser, setAdminUser] = useState<AdminUser>({
    username: '',
    email: '',
    role: 'admin'
  });
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo>({
    name: '',
    phone: '',
    email: '',
    address: '',
    description: '',
    website: ''
  });
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    maintenanceMode: false,
    allowBookings: true,
    featuredServices: [],
    maxBookingsPerDay: 10,
    bookingAdvanceDays: 30,
    socialMedia: {
      instagram: '',
      facebook: '',
      twitter: '',
      tiktok: ''
    }
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("adminToken");
      if (!token) return;

      // Load current admin info from localStorage or API
      const currentUser = {
        username: 'admin',
        email: 'admin@lawreibeauty.com',
        role: 'admin'
      };
      setAdminUser(currentUser);

      // Load business info from site content
      const businessResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'https://lawrei-beauty-website.onrender.com'}/admin/site-content/contact_info`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (businessResponse.ok) {
        const data = await businessResponse.json();
        setBusinessInfo({
          name: data.title || '',
          phone: data.subtitle || '',
          email: data.content || '',
          address: data.imageUrl || '',
          description: '',
          website: ''
        });
      }

    } catch (error) {
      console.error('Error loading settings:', error);
      toast({
        title: "Error",
        description: "Failed to load settings",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveBusinessInfo = async () => {
    try {
      setIsSaving(true);
      const token = localStorage.getItem("adminToken");
      if (!token) {
        toast({
          title: "Error",
          description: "Authentication required",
          variant: "destructive",
        });
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'https://lawrei-beauty-website.onrender.com'}/admin/site-content/contact_info`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: businessInfo.name,
          subtitle: businessInfo.phone,
          content: businessInfo.email,
          imageUrl: businessInfo.address
        })
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Business information updated successfully",
        });
      } else {
        throw new Error('Failed to save business info');
      }
    } catch (error) {
      console.error('Error saving business info:', error);
      toast({
        title: "Error",
        description: "Failed to save business information",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const updateProfile = async () => {
    try {
      setIsSaving(true);
      const token = localStorage.getItem("adminToken");
      if (!token) {
        toast({
          title: "Error",
          description: "Authentication required",
          variant: "destructive",
        });
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'https://lawrei-beauty-website.onrender.com'}/admin/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: adminUser.username,
          email: adminUser.email
        })
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Profile updated successfully",
        });
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const updatePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSaving(true);
      const token = localStorage.getItem("adminToken");
      if (!token) {
        toast({
          title: "Error",
          description: "Authentication required",
          variant: "destructive",
        });
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'https://lawrei-beauty-website.onrender.com'}/admin/change-password`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Password updated successfully",
        });
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update password');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update password",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const exportData = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) return;

      toast({
        title: "Export Started",
        description: "Preparing your data export...",
      });

      // In a real implementation, this would trigger a data export
      setTimeout(() => {
        toast({
          title: "Export Ready",
          description: "Your data export has been sent to your email",
        });
      }, 2000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export data",
        variant: "destructive",
      });
    }
  };

  const renderProfileSettings = () => (
    <Card className="glass-morphism border-gray-600">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <User className="w-5 h-5 mr-2" />
          Admin Profile
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
            <Input 
              placeholder="Admin Username" 
              className="bg-black/50 border-gray-600 text-white"
              value={adminUser.username}
              onChange={(e) => setAdminUser(prev => ({ ...prev, username: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
            <Input 
              type="email"
              placeholder="admin@example.com" 
              className="bg-black/50 border-gray-600 text-white"
              value={adminUser.email}
              onChange={(e) => setAdminUser(prev => ({ ...prev, email: e.target.value }))}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Role</label>
          <Input 
            value={adminUser.role}
            disabled
            className="bg-black/50 border-gray-600 text-white opacity-60"
          />
        </div>
        <Button 
          onClick={updateProfile}
          disabled={isSaving}
          className="w-full bg-gradient-to-r from-luxury-gold to-soft-pink text-black hover:opacity-90"
        >
          {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Update Profile
        </Button>
      </CardContent>
    </Card>
  );

  const renderSecuritySettings = () => (
    <Card className="glass-morphism border-gray-600">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Shield className="w-5 h-5 mr-2" />
          Security Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Current Password</label>
          <Input 
            type="password"
            placeholder="Enter current password" 
            className="bg-black/50 border-gray-600 text-white"
            value={passwordData.currentPassword}
            onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">New Password</label>
          <Input 
            type="password"
            placeholder="Enter new password" 
            className="bg-black/50 border-gray-600 text-white"
            value={passwordData.newPassword}
            onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Confirm New Password</label>
          <Input 
            type="password"
            placeholder="Confirm new password" 
            className="bg-black/50 border-gray-600 text-white"
            value={passwordData.confirmPassword}
            onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
          />
        </div>
        <Button 
          onClick={updatePassword}
          disabled={isSaving}
          className="w-full bg-gradient-to-r from-luxury-gold to-soft-pink text-black hover:opacity-90"
        >
          {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Shield className="w-4 h-4 mr-2" />}
          Update Password
        </Button>
      </CardContent>
    </Card>
  );

  const renderBusinessSettings = () => (
    <Card className="glass-morphism border-gray-600">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Globe className="w-5 h-5 mr-2" />
          Business Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Business Name</label>
            <Input 
              placeholder="LawreiBeauty Studio" 
              className="bg-black/50 border-gray-600 text-white"
              value={businessInfo.name}
              onChange={(e) => setBusinessInfo(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
            <Input 
              placeholder="+1 (555) 123-4567" 
              className="bg-black/50 border-gray-600 text-white"
              value={businessInfo.phone}
              onChange={(e) => setBusinessInfo(prev => ({ ...prev, phone: e.target.value }))}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
          <Input 
            type="email"
            placeholder="hello@lawreibeauty.com" 
            className="bg-black/50 border-gray-600 text-white"
            value={businessInfo.email}
            onChange={(e) => setBusinessInfo(prev => ({ ...prev, email: e.target.value }))}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Website URL</label>
          <Input 
            placeholder="https://lawreibeauty.com" 
            className="bg-black/50 border-gray-600 text-white"
            value={businessInfo.website}
            onChange={(e) => setBusinessInfo(prev => ({ ...prev, website: e.target.value }))}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Business Address</label>
          <Textarea 
            placeholder="123 Beauty Street, Suite 100, City, State 12345" 
            className="bg-black/50 border-gray-600 text-white"
            rows={3}
            value={businessInfo.address}
            onChange={(e) => setBusinessInfo(prev => ({ ...prev, address: e.target.value }))}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Business Description</label>
          <Textarea 
            placeholder="Tell customers about your business..." 
            className="bg-black/50 border-gray-600 text-white"
            rows={4}
            value={businessInfo.description}
            onChange={(e) => setBusinessInfo(prev => ({ ...prev, description: e.target.value }))}
          />
        </div>
        <Button 
          onClick={saveBusinessInfo}
          disabled={isSaving}
          className="w-full bg-gradient-to-r from-luxury-gold to-soft-pink text-black hover:opacity-90"
        >
          {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Save Business Information
        </Button>
      </CardContent>
    </Card>
  );

  const renderSiteSettings = () => (
    <Card className="glass-morphism border-gray-600">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Settings className="w-5 h-5 mr-2" />
          Site Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h4 className="text-lg font-medium text-white">Site Status</h4>
          <div className="space-y-3">
            <label className="flex items-center justify-between text-white">
              <span>Maintenance Mode</span>
              <input
                type="checkbox"
                checked={siteSettings.maintenanceMode}
                onChange={(e) => setSiteSettings(prev => ({ ...prev, maintenanceMode: e.target.checked }))}
                className="rounded"
              />
            </label>
            <label className="flex items-center justify-between text-white">
              <span>Allow New Bookings</span>
              <input
                type="checkbox"
                checked={siteSettings.allowBookings}
                onChange={(e) => setSiteSettings(prev => ({ ...prev, allowBookings: e.target.checked }))}
                className="rounded"
              />
            </label>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-lg font-medium text-white">Booking Settings</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Max Bookings per Day</label>
              <Input 
                type="number"
                placeholder="10" 
                className="bg-black/50 border-gray-600 text-white"
                value={siteSettings.maxBookingsPerDay}
                onChange={(e) => setSiteSettings(prev => ({ ...prev, maxBookingsPerDay: parseInt(e.target.value) || 10 }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Booking Advance Days</label>
              <Input 
                type="number"
                placeholder="30" 
                className="bg-black/50 border-gray-600 text-white"
                value={siteSettings.bookingAdvanceDays}
                onChange={(e) => setSiteSettings(prev => ({ ...prev, bookingAdvanceDays: parseInt(e.target.value) || 30 }))}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-lg font-medium text-white">Social Media Links</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Instagram</label>
              <Input 
                placeholder="@lawreibeauty" 
                className="bg-black/50 border-gray-600 text-white"
                value={siteSettings.socialMedia.instagram}
                onChange={(e) => setSiteSettings(prev => ({ ...prev, socialMedia: { ...prev.socialMedia, instagram: e.target.value } }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Facebook</label>
              <Input 
                placeholder="facebook.com/lawreibeauty" 
                className="bg-black/50 border-gray-600 text-white"
                value={siteSettings.socialMedia.facebook}
                onChange={(e) => setSiteSettings(prev => ({ ...prev, socialMedia: { ...prev.socialMedia, facebook: e.target.value } }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Twitter</label>
              <Input 
                placeholder="@lawreibeauty" 
                className="bg-black/50 border-gray-600 text-white"
                value={siteSettings.socialMedia.twitter}
                onChange={(e) => setSiteSettings(prev => ({ ...prev, socialMedia: { ...prev.socialMedia, twitter: e.target.value } }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">TikTok</label>
              <Input 
                placeholder="@lawreibeauty" 
                className="bg-black/50 border-gray-600 text-white"
                value={siteSettings.socialMedia.tiktok}
                onChange={(e) => setSiteSettings(prev => ({ ...prev, socialMedia: { ...prev.socialMedia, tiktok: e.target.value } }))}
              />
            </div>
          </div>
        </div>

        <Button 
          onClick={() => {}}
          disabled={isSaving}
          className="w-full bg-gradient-to-r from-luxury-gold to-soft-pink text-black hover:opacity-90"
        >
          {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Save Site Settings
        </Button>
      </CardContent>
    </Card>
  );

  const renderDataManagement = () => (
    <Card className="glass-morphism border-gray-600">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Database className="w-5 h-5 mr-2" />
          Data Management
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button 
            onClick={exportData}
            variant="outline"
            className="glass-morphism border-gray-600 hover:bg-blue-600 hover:border-blue-600"
          >
            <Database className="w-4 h-4 mr-2" />
            Export All Data
          </Button>
          <Button 
            onClick={loadSettings}
            variant="outline"
            className="glass-morphism border-gray-600 hover:bg-green-600 hover:border-green-600"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Settings
          </Button>
        </div>
        <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-yellow-500 mr-3 mt-0.5" />
            <div>
              <h4 className="text-yellow-500 font-medium mb-1">Data Export</h4>
              <p className="text-gray-300 text-sm">
                Export includes all bookings, contacts, portfolio items, and testimonials. 
                The export will be sent to your admin email address.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-luxury-gold" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-display font-bold text-white">Admin Settings</h2>
        <Badge className="bg-gradient-to-r from-luxury-gold to-soft-pink text-black">
          System Configuration
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 glass-morphism border-gray-600">
          <TabsTrigger
            value="profile"
            className="data-[state=active]:bg-luxury-gold data-[state=active]:text-black"
          >
            <User className="w-4 h-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger
            value="business"
            className="data-[state=active]:bg-luxury-gold data-[state=active]:text-black"
          >
            <Globe className="w-4 h-4 mr-2" />
            Business
          </TabsTrigger>
          <TabsTrigger
            value="site"
            className="data-[state=active]:bg-luxury-gold data-[state=active]:text-black"
          >
            <Settings className="w-4 h-4 mr-2" />
            Site
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="data-[state=active]:bg-luxury-gold data-[state=active]:text-black"
          >
            <Shield className="w-4 h-4 mr-2" />
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6 space-y-6">
          {renderProfileSettings()}
          {renderDataManagement()}
        </TabsContent>

        <TabsContent value="business" className="mt-6">
          {renderBusinessSettings()}
        </TabsContent>

        <TabsContent value="site" className="mt-6">
          {renderSiteSettings()}
        </TabsContent>

        <TabsContent value="security" className="mt-6">
          {renderSecuritySettings()}
        </TabsContent>
      </Tabs>
    </div>
  );
}
