import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Image, Edit, Trash2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AdminPortfolio() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newItem, setNewItem] = useState({
    title: '',
    description: '',
    imageUrl: '',
    category: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const fetchPortfolio = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("adminToken");
      if (!token) {
        toast({
          title: "Error",
          description: "Authentication required",
          variant: "destructive",
        });
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'https://lawrei-beauty-website.onrender.com'}/admin/portfolio`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setPortfolioItems(data);
      } else {
        throw new Error('Failed to fetch portfolio');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch portfolio from database",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddItem = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        toast({
          title: "Error",
          description: "Authentication required",
          variant: "destructive",
        });
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'https://lawrei-beauty-website.onrender.com'}/admin/portfolio`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...newItem,
          isActive: true
        })
      });

      if (response.ok) {
        const addedItem = await response.json();
        setPortfolioItems(prev => [...prev, addedItem]);
        setNewItem({ title: '', description: '', imageUrl: '', category: '' });
        setShowAddForm(false);
        toast({
          title: "Success",
          description: "Portfolio item added successfully",
        });
      } else {
        throw new Error('Failed to add portfolio item');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add portfolio item",
        variant: "destructive",
      });
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm("Are you sure you want to delete this portfolio item?")) return;

    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        toast({
          title: "Error",
          description: "Authentication required",
          variant: "destructive",
        });
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'https://lawrei-beauty-website.onrender.com'}/admin/portfolio/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setPortfolioItems(prev => prev.filter(item => item.id !== id));
        toast({
          title: "Success",
          description: "Portfolio item deleted successfully",
        });
      } else {
        throw new Error('Failed to delete portfolio item');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete portfolio item",
        variant: "destructive",
      });
    }
  };

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
              <Input 
                placeholder="Title" 
                className="bg-black/50 border-gray-600"
                value={newItem.title}
                onChange={(e) => setNewItem(prev => ({ ...prev, title: e.target.value }))}
              />
              <Input 
                placeholder="Category" 
                className="bg-black/50 border-gray-600"
                value={newItem.category}
                onChange={(e) => setNewItem(prev => ({ ...prev, category: e.target.value }))}
              />
              <Input 
                placeholder="Image URL" 
                className="bg-black/50 border-gray-600"
                value={newItem.imageUrl}
                onChange={(e) => setNewItem(prev => ({ ...prev, imageUrl: e.target.value }))}
              />
              <Input 
                placeholder="Description" 
                className="bg-black/50 border-gray-600"
                value={newItem.description}
                onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
              />
              <Button 
                className="w-full bg-gradient-to-r from-luxury-gold to-soft-pink text-black"
                onClick={handleAddItem}
              >
                Save Item
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-luxury-gold" />
        </div>
      ) : portfolioItems.length === 0 ? (
        <Card className="glass-morphism border-gray-600">
          <CardContent className="p-12 text-center">
            <Image className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold text-white mb-2">No Portfolio Items</h3>
            <p className="text-gray-400">Start by adding your first portfolio item above.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolioItems.map((item) => (
            <Card key={item.id} className="glass-morphism border-gray-600">
              <CardContent className="p-4">
                <div className="relative mb-4">
                  <img 
                    src={item.imageUrl || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80"}
                    alt={item.title}
                    className="w-full h-48 object-cover rounded-lg"
                    onError={(e) => {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80";
                    }}
                  />
                  <Badge className={`absolute top-2 left-2 ${item.isActive ? 'bg-gradient-to-r from-luxury-gold to-soft-pink text-black' : 'bg-gray-600'}`}>
                    {item.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <h3 className="font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-gray-400 mb-2">{item.description}</p>
                <p className="text-xs text-gray-500 mb-4">Category: {item.category}</p>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => handleDeleteItem(item.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
