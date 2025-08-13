import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Image, Edit, Trash2 } from "lucide-react";

export default function AdminPortfolio() {
  const [showAddForm, setShowAddForm] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-display font-bold text-white">Portfolio Management</h2>
        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-gradient-to-r from-luxury-gold to-soft-pink text-black hover:opacity-90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Portfolio Item
        </Button>
      </div>

      {showAddForm && (
        <Card className="glass-morphism border-luxury-gold/30">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Add New Portfolio Item</h3>
            <div className="space-y-4">
              <Input placeholder="Title" className="bg-black/50 border-gray-600" />
              <Input placeholder="Category" className="bg-black/50 border-gray-600" />
              <Input placeholder="Image URL" className="bg-black/50 border-gray-600" />
              <Button className="w-full bg-gradient-to-r from-luxury-gold to-soft-pink text-black">
                Save Item
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="glass-morphism border-gray-600">
          <CardContent className="p-4">
            <div className="relative mb-4">
              <img 
                src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80"
                alt="Portfolio item"
                className="w-full h-48 object-cover rounded-lg"
              />
              <Badge className="absolute top-2 left-2 bg-gradient-to-r from-luxury-gold to-soft-pink text-black">
                Featured
              </Badge>
            </div>
            <h3 className="font-semibold text-white mb-2">Bridal Elegance</h3>
            <p className="text-sm text-gray-400 mb-4">Classic bridal makeup with a modern twist</p>
            <div className="flex space-x-2">
              <Button size="sm" variant="outline" className="flex-1">
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </Button>
              <Button size="sm" variant="outline" className="flex-1">
                <Trash2 className="w-4 h-4 mr-1" />
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
