import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Settings, Save, User, Mail, Phone, MapPin } from "lucide-react";

export default function AdminSettings() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-display font-bold text-white">Admin Settings</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-morphism border-gray-600">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <User className="w-5 h-5 mr-2" />
              Profile Settings
            </h3>
            <div className="space-y-4">
              <Input placeholder="Admin Username" className="bg-black/50 border-gray-600" />
              <Input placeholder="New Password" type="password" className="bg-black/50 border-gray-600" />
              <Input placeholder="Confirm Password" type="password" className="bg-black/50 border-gray-600" />
              <Button className="w-full bg-gradient-to-r from-luxury-gold to-soft-pink text-black">
                <Save className="w-4 h-4 mr-2" />
                Update Profile
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-morphism border-gray-600">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              Business Information
            </h3>
            <div className="space-y-4">
              <Input placeholder="Business Name" className="bg-black/50 border-gray-600" />
              <Input placeholder="Phone Number" className="bg-black/50 border-gray-600" />
              <Input placeholder="Email Address" className="bg-black/50 border-gray-600" />
              <Input placeholder="Location" className="bg-black/50 border-gray-600" />
              <Button className="w-full bg-gradient-to-r from-luxury-gold to-soft-pink text-black">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
