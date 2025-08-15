import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Image, Edit, Trash2, Loader2, Upload } from "lucide-react";
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

const PORTFOLIO_CATEGORIES = [
  'facial',
  'massage', 
  'manicure',
  'pedicure',
  'hair',
  'makeup',
  'waxing',
  'bridal',
  'special-event',
  'other'
];

export default function AdminPortfolio() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newItem, setNewItem] = useState({
    title: '',
    description: '',
    imageUrl: '',
    category: 'makeup'
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
      console.error('Error fetching portfolio:', error);
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
        setNewItem({ title: '', description: '', imageUrl: '', category: 'makeup' });
        setShowAddForm(false);
        toast({
          title: "Success",
          description: "Portfolio item added successfully",
        });
      } else {
        throw new Error('Failed to add portfolio item');
      }
    } catch (error) {
      console.error('Error adding portfolio item:', error);
      toast({
        title: "Error",
        description: "Failed to add portfolio item",
        variant: "destructive",
      });
    }
  };

  const handleEditItem = async () => {
    if (!editingItem) return;

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

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'https://lawrei-beauty-website.onrender.com'}/admin/portfolio/${editingItem.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: editingItem.title,
          description: editingItem.description,
          imageUrl: editingItem.imageUrl,
          category: editingItem.category,
          isActive: editingItem.isActive
        })
      });

      if (response.ok) {
        const updatedItem = await response.json();
        setPortfolioItems(prev => prev.map(item => 
          item.id === editingItem.id ? updatedItem : item
        ));
        setEditingItem(null);
        toast({
          title: "Success",
          description: "Portfolio item updated successfully",
        });
      } else {
        throw new Error('Failed to update portfolio item');
      }
    } catch (error) {
      console.error('Error updating portfolio item:', error);
      toast({
        title: "Error",
        description: "Failed to update portfolio item",
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
      console.error('Error deleting portfolio item:', error);
      toast({
        title: "Error",
        description: "Failed to delete portfolio item",
        variant: "destructive",
      });
    }
  };

  const handleImageUpload = async (file: File, isEditing = false) => {
    try {
      // Convert file to base64 for simple upload
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = e.target?.result as string;
        
        const token = localStorage.getItem("adminToken");
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'https://lawrei-beauty-website.onrender.com'}/admin/upload-image`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            imageData: base64,
            fileName: file.name,
            folder: 'portfolio'
          })
        });

        if (response.ok) {
          const { imageUrl } = await response.json();
          if (isEditing && editingItem) {
            setEditingItem(prev => prev ? { ...prev, imageUrl } : null);
          } else {
            setNewItem(prev => ({ ...prev, imageUrl }));
          }
          toast({
            title: "Success",
            description: "Image uploaded successfully",
          });
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Error",
        description: "Failed to upload image",
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input 
                placeholder="Title" 
                className="bg-black/50 border-gray-600 text-white"
                value={newItem.title}
                onChange={(e) => setNewItem(prev => ({ ...prev, title: e.target.value }))}
              />
              <select
                value={newItem.category}
                onChange={(e) => setNewItem(prev => ({ ...prev, category: e.target.value }))}
                className="px-3 py-2 bg-black/50 border border-gray-600 rounded-md text-white focus:border-luxury-gold focus:outline-none"
              >
                {PORTFOLIO_CATEGORIES.map(cat => (
                  <option key={cat} value={cat} className="bg-black">
                    {cat.charAt(0).toUpperCase() + cat.slice(1).replace('-', ' ')}
                  </option>
                ))}
              </select>
              <Input 
                placeholder="Image URL" 
                className="bg-black/50 border-gray-600 text-white md:col-span-2"
                value={newItem.imageUrl}
                onChange={(e) => setNewItem(prev => ({ ...prev, imageUrl: e.target.value }))}
              />
              <Textarea 
                placeholder="Description" 
                className="bg-black/50 border-gray-600 text-white md:col-span-2"
                value={newItem.description}
                onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>
            <div className="flex gap-4 mt-6">
              <Button 
                className="flex-1 bg-gradient-to-r from-luxury-gold to-soft-pink text-black"
                onClick={handleAddItem}
              >
                Save Item
              </Button>
              <Button 
                variant="outline"
                className="flex-1 border-gray-600"
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {editingItem && (
        <Card className="glass-morphism border-luxury-gold/30">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Edit Portfolio Item</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input 
                placeholder="Title" 
                className="bg-black/50 border-gray-600 text-white"
                value={editingItem.title}
                onChange={(e) => setEditingItem(prev => prev ? ({ ...prev, title: e.target.value }) : null)}
              />
              <select
                value={editingItem.category}
                onChange={(e) => setEditingItem(prev => prev ? ({ ...prev, category: e.target.value }) : null)}
                className="px-3 py-2 bg-black/50 border border-gray-600 rounded-md text-white focus:border-luxury-gold focus:outline-none"
              >
                {PORTFOLIO_CATEGORIES.map(cat => (
                  <option key={cat} value={cat} className="bg-black">
                    {cat.charAt(0).toUpperCase() + cat.slice(1).replace('-', ' ')}
                  </option>
                ))}
              </select>
              <Input 
                placeholder="Image URL" 
                className="bg-black/50 border-gray-600 text-white md:col-span-2"
                value={editingItem.imageUrl}
                onChange={(e) => setEditingItem(prev => prev ? ({ ...prev, imageUrl: e.target.value }) : null)}
              />
              <Textarea 
                placeholder="Description" 
                className="bg-black/50 border-gray-600 text-white md:col-span-2"
                value={editingItem.description}
                onChange={(e) => setEditingItem(prev => prev ? ({ ...prev, description: e.target.value }) : null)}
                rows={3}
              />
              <div className="md:col-span-2">
                <label className="flex items-center space-x-2 text-white">
                  <input
                    type="checkbox"
                    checked={editingItem.isActive}
                    onChange={(e) => setEditingItem(prev => prev ? ({ ...prev, isActive: e.target.checked }) : null)}
                    className="rounded"
                  />
                  <span>Active Item</span>
                </label>
              </div>
            </div>
            <div className="flex gap-4 mt-6">
              <Button 
                className="flex-1 bg-gradient-to-r from-luxury-gold to-soft-pink text-black"
                onClick={handleEditItem}
              >
                Update Item
              </Button>
              <Button 
                variant="outline"
                className="flex-1 border-gray-600"
                onClick={() => setEditingItem(null)}
              >
                Cancel
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
            <Card key={item.id} className="glass-morphism border-gray-600 hover:border-luxury-gold transition-colors">
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
                <p className="text-sm text-gray-400 mb-2 line-clamp-2">{item.description}</p>
                <p className="text-xs text-gray-500 mb-4">
                  Category: {item.category.charAt(0).toUpperCase() + item.category.slice(1).replace('-', ' ')}
                </p>
                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1 glass-morphism border-gray-600 hover:bg-luxury-gold hover:text-black"
                    onClick={() => setEditingItem(item)}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1 glass-morphism border-gray-600 hover:bg-red-600 hover:border-red-600"
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
