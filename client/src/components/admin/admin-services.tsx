import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Wrench, 
  Edit, 
  Trash2, 
  Loader2, 
  DollarSign, 
  Clock, 
  Tag,
  Image as ImageIcon,
  Upload
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Service {
  id: string;
  name: string;
  description: string;
  category: string;
  duration: number;
  price: number;
  imageUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const SERVICE_CATEGORIES = [
  'facial',
  'massage', 
  'manicure',
  'pedicure',
  'hair',
  'makeup',
  'waxing',
  'other'
];

export default function AdminServices() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newService, setNewService] = useState({
    name: '',
    description: '',
    category: 'facial',
    duration: 60,
    price: 0,
    imageUrl: '',
    isActive: true
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
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

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'https://lawrei-beauty-website.onrender.com'}/admin/services`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setServices(data);
      } else {
        throw new Error('Failed to fetch services');
      }
    } catch (error) {
      console.error('Error fetching services:', error);
      toast({
        title: "Error",
        description: "Failed to fetch services from database",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddService = async () => {
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

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'https://lawrei-beauty-website.onrender.com'}/admin/services`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newService)
      });

      if (response.ok) {
        const addedService = await response.json();
        setServices(prev => [...prev, addedService]);
        setNewService({ name: '', description: '', category: 'facial', duration: 60, price: 0, imageUrl: '', isActive: true });
        setShowAddForm(false);
        toast({
          title: "Success",
          description: "Service added successfully",
        });
      } else {
        throw new Error('Failed to add service');
      }
    } catch (error) {
      console.error('Error adding service:', error);
      toast({
        title: "Error",
        description: "Failed to add service",
        variant: "destructive",
      });
    }
  };

  const handleEditService = async () => {
    if (!editingService) return;

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

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'https://lawrei-beauty-website.onrender.com'}/admin/services/${editingService.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: editingService.name,
          description: editingService.description,
          category: editingService.category,
          duration: editingService.duration,
          price: editingService.price / 100, // Convert from cents
          imageUrl: editingService.imageUrl,
          isActive: editingService.isActive
        })
      });

      if (response.ok) {
        const updatedService = await response.json();
        setServices(prev => prev.map(service => 
          service.id === editingService.id ? updatedService : service
        ));
        setEditingService(null);
        toast({
          title: "Success",
          description: "Service updated successfully",
        });
      } else {
        throw new Error('Failed to update service');
      }
    } catch (error) {
      console.error('Error updating service:', error);
      toast({
        title: "Error",
        description: "Failed to update service",
        variant: "destructive",
      });
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;

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

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'https://lawrei-beauty-website.onrender.com'}/admin/services/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setServices(prev => prev.filter(service => service.id !== id));
        toast({
          title: "Success",
          description: "Service deleted successfully",
        });
      } else {
        throw new Error('Failed to delete service');
      }
    } catch (error) {
      console.error('Error deleting service:', error);
      toast({
        title: "Error",
        description: "Failed to delete service",
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
            folder: 'services'
          })
        });

        if (response.ok) {
          const { imageUrl } = await response.json();
          if (isEditing && editingService) {
            setEditingService(prev => prev ? { ...prev, imageUrl } : null);
          } else {
            setNewService(prev => ({ ...prev, imageUrl }));
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
        <h2 className="text-2xl font-display font-bold text-white">Services Management</h2>
        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-gradient-to-r from-luxury-gold to-soft-pink text-black hover:opacity-90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Service
        </Button>
      </div>

      {showAddForm && (
        <Card className="glass-morphism border-luxury-gold/30">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Add New Service</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input 
                placeholder="Service Name" 
                className="bg-black/50 border-gray-600 text-white"
                value={newService.name}
                onChange={(e) => setNewService(prev => ({ ...prev, name: e.target.value }))}
              />
              <select
                value={newService.category}
                onChange={(e) => setNewService(prev => ({ ...prev, category: e.target.value }))}
                className="px-3 py-2 bg-black/50 border border-gray-600 rounded-md text-white focus:border-luxury-gold focus:outline-none"
              >
                {SERVICE_CATEGORIES.map(cat => (
                  <option key={cat} value={cat} className="bg-black">
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
              <Input 
                type="number"
                placeholder="Duration (minutes)" 
                className="bg-black/50 border-gray-600 text-white"
                value={newService.duration}
                onChange={(e) => setNewService(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
              />
              <Input 
                type="number"
                placeholder="Price ($)" 
                className="bg-black/50 border-gray-600 text-white"
                value={newService.price}
                onChange={(e) => setNewService(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
              />
              <Input 
                placeholder="Image URL (optional)" 
                className="bg-black/50 border-gray-600 text-white md:col-span-2"
                value={newService.imageUrl}
                onChange={(e) => setNewService(prev => ({ ...prev, imageUrl: e.target.value }))}
              />
              <Textarea 
                placeholder="Description" 
                className="bg-black/50 border-gray-600 text-white md:col-span-2"
                value={newService.description}
                onChange={(e) => setNewService(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
              <div className="md:col-span-2">
                <label className="flex items-center space-x-2 text-white">
                  <input
                    type="checkbox"
                    checked={newService.isActive}
                    onChange={(e) => setNewService(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="rounded"
                  />
                  <span>Active Service</span>
                </label>
              </div>
            </div>
            <div className="flex gap-4 mt-6">
              <Button 
                className="flex-1 bg-gradient-to-r from-luxury-gold to-soft-pink text-black"
                onClick={handleAddService}
              >
                Save Service
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

      {editingService && (
        <Card className="glass-morphism border-luxury-gold/30">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Edit Service</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input 
                placeholder="Service Name" 
                className="bg-black/50 border-gray-600 text-white"
                value={editingService.name}
                onChange={(e) => setEditingService(prev => prev ? ({ ...prev, name: e.target.value }) : null)}
              />
              <select
                value={editingService.category}
                onChange={(e) => setEditingService(prev => prev ? ({ ...prev, category: e.target.value }) : null)}
                className="px-3 py-2 bg-black/50 border border-gray-600 rounded-md text-white focus:border-luxury-gold focus:outline-none"
              >
                {SERVICE_CATEGORIES.map(cat => (
                  <option key={cat} value={cat} className="bg-black">
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
              <Input 
                type="number"
                placeholder="Duration (minutes)" 
                className="bg-black/50 border-gray-600 text-white"
                value={editingService.duration}
                onChange={(e) => setEditingService(prev => prev ? ({ ...prev, duration: parseInt(e.target.value) || 0 }) : null)}
              />
              <Input 
                type="number"
                placeholder="Price ($)" 
                className="bg-black/50 border-gray-600 text-white"
                value={editingService.price / 100} // Convert from cents
                onChange={(e) => setEditingService(prev => prev ? ({ ...prev, price: (parseFloat(e.target.value) || 0) * 100 }) : null)}
              />
              <Input 
                placeholder="Image URL (optional)" 
                className="bg-black/50 border-gray-600 text-white md:col-span-2"
                value={editingService.imageUrl || ''}
                onChange={(e) => setEditingService(prev => prev ? ({ ...prev, imageUrl: e.target.value }) : null)}
              />
              <Textarea 
                placeholder="Description" 
                className="bg-black/50 border-gray-600 text-white md:col-span-2"
                value={editingService.description}
                onChange={(e) => setEditingService(prev => prev ? ({ ...prev, description: e.target.value }) : null)}
                rows={3}
              />
              <div className="md:col-span-2">
                <label className="flex items-center space-x-2 text-white">
                  <input
                    type="checkbox"
                    checked={editingService.isActive}
                    onChange={(e) => setEditingService(prev => prev ? ({ ...prev, isActive: e.target.checked }) : null)}
                    className="rounded"
                  />
                  <span>Active Service</span>
                </label>
              </div>
            </div>
            <div className="flex gap-4 mt-6">
              <Button 
                className="flex-1 bg-gradient-to-r from-luxury-gold to-soft-pink text-black"
                onClick={handleEditService}
              >
                Update Service
              </Button>
              <Button 
                variant="outline"
                className="flex-1 border-gray-600"
                onClick={() => setEditingService(null)}
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
      ) : services.length === 0 ? (
        <Card className="glass-morphism border-gray-600">
          <CardContent className="p-12 text-center">
            <Wrench className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold text-white mb-2">No Services</h3>
            <p className="text-gray-400">Start by adding your first service above.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <Card key={service.id} className="glass-morphism border-gray-600 hover:border-luxury-gold transition-colors">
              <CardContent className="p-4">
                {service.imageUrl && (
                  <div className="relative mb-4">
                    <img 
                      src={service.imageUrl}
                      alt={service.name}
                      className="w-full h-48 object-cover rounded-lg"
                      onError={(e) => {
                        e.currentTarget.src = "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80";
                      }}
                    />
                    <Badge className={`absolute top-2 left-2 ${service.isActive ? 'bg-gradient-to-r from-luxury-gold to-soft-pink text-black' : 'bg-gray-600'}`}>
                      {service.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                )}
                
                <h3 className="font-semibold text-white mb-2">{service.name}</h3>
                <p className="text-sm text-gray-400 mb-3 line-clamp-2">{service.description}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400 flex items-center">
                      <Tag className="w-3 h-3 mr-1" />
                      Category:
                    </span>
                    <span className="text-luxury-gold font-medium">
                      {service.category.charAt(0).toUpperCase() + service.category.slice(1)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400 flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      Duration:
                    </span>
                    <span className="text-luxury-gold font-medium">{service.duration} min</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400 flex items-center">
                      <DollarSign className="w-3 h-3 mr-1" />
                      Price:
                    </span>
                    <span className="text-luxury-gold font-medium">${(service.price / 100).toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1 glass-morphism border-gray-600 hover:bg-luxury-gold hover:text-black"
                    onClick={() => setEditingService(service)}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1 glass-morphism border-gray-600 hover:bg-red-600 hover:border-red-600"
                    onClick={() => handleDeleteService(service.id)}
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