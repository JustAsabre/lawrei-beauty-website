import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Star, 
  Edit, 
  Trash2, 
  Loader2, 
  User, 
  Mail,
  Check,
  X,
  MessageSquare
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Testimonial {
  id: string;
  rating: number;
  review: string;
  isApproved: boolean;
  createdAt: string;
  customerFirstName?: string;
  customerLastName?: string;
  customerEmail?: string;
  serviceName?: string;
}

export default function AdminTestimonials() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newTestimonial, setNewTestimonial] = useState({
    customerFirstName: '',
    customerLastName: '',
    customerEmail: '',
    rating: 5,
    review: '',
    isApproved: false
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
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

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'https://lawrei-beauty-website.onrender.com'}/admin/testimonials`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setTestimonials(data);
      } else {
        throw new Error('Failed to fetch testimonials');
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      toast({
        title: "Error",
        description: "Failed to fetch testimonials from database",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTestimonial = async () => {
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

      // Create a temporary customer for the testimonial
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'https://lawrei-beauty-website.onrender.com'}/admin/testimonials`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          customerId: 'temp-customer', // You might want to create an actual customer
          rating: newTestimonial.rating,
          review: newTestimonial.review,
          isApproved: newTestimonial.isApproved
        })
      });

      if (response.ok) {
        const addedTestimonial = await response.json();
        setTestimonials(prev => [...prev, addedTestimonial]);
        setNewTestimonial({ customerFirstName: '', customerLastName: '', customerEmail: '', rating: 5, review: '', isApproved: false });
        setShowAddForm(false);
        toast({
          title: "Success",
          description: "Testimonial added successfully",
        });
      } else {
        throw new Error('Failed to add testimonial');
      }
    } catch (error) {
      console.error('Error adding testimonial:', error);
      toast({
        title: "Error",
        description: "Failed to add testimonial",
        variant: "destructive",
      });
    }
  };

  const handleEditTestimonial = async () => {
    if (!editingTestimonial) return;

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

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'https://lawrei-beauty-website.onrender.com'}/admin/testimonials/${editingTestimonial.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          rating: editingTestimonial.rating,
          review: editingTestimonial.review,
          isApproved: editingTestimonial.isApproved
        })
      });

      if (response.ok) {
        const updatedTestimonial = await response.json();
        setTestimonials(prev => prev.map(testimonial => 
          testimonial.id === editingTestimonial.id ? updatedTestimonial : testimonial
        ));
        setEditingTestimonial(null);
        toast({
          title: "Success",
          description: "Testimonial updated successfully",
        });
      } else {
        throw new Error('Failed to update testimonial');
      }
    } catch (error) {
      console.error('Error updating testimonial:', error);
      toast({
        title: "Error",
        description: "Failed to update testimonial",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;

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

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'https://lawrei-beauty-website.onrender.com'}/admin/testimonials/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setTestimonials(prev => prev.filter(testimonial => testimonial.id !== id));
        toast({
          title: "Success",
          description: "Testimonial deleted successfully",
        });
      } else {
        throw new Error('Failed to delete testimonial');
      }
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      toast({
        title: "Error",
        description: "Failed to delete testimonial",
        variant: "destructive",
      });
    }
  };

  const toggleApproval = async (id: string, isApproved: boolean) => {
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

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'https://lawrei-beauty-website.onrender.com'}/admin/testimonials/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isApproved })
      });

      if (response.ok) {
        const updatedTestimonial = await response.json();
        setTestimonials(prev => prev.map(testimonial => 
          testimonial.id === id ? updatedTestimonial : testimonial
        ));
        toast({
          title: "Success",
          description: `Testimonial ${isApproved ? 'approved' : 'unapproved'} successfully`,
        });
      } else {
        throw new Error('Failed to update testimonial approval');
      }
    } catch (error) {
      console.error('Error updating testimonial approval:', error);
      toast({
        title: "Error",
        description: "Failed to update testimonial approval",
        variant: "destructive",
      });
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-400'}`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-display font-bold text-white">Testimonials Management</h2>
        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-gradient-to-r from-luxury-gold to-soft-pink text-black hover:opacity-90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Testimonial
        </Button>
      </div>

      {showAddForm && (
        <Card className="glass-morphism border-luxury-gold/30">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Add New Testimonial</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input 
                placeholder="Customer First Name" 
                className="bg-black/50 border-gray-600 text-white"
                value={newTestimonial.customerFirstName}
                onChange={(e) => setNewTestimonial(prev => ({ ...prev, customerFirstName: e.target.value }))}
              />
              <Input 
                placeholder="Customer Last Name" 
                className="bg-black/50 border-gray-600 text-white"
                value={newTestimonial.customerLastName}
                onChange={(e) => setNewTestimonial(prev => ({ ...prev, customerLastName: e.target.value }))}
              />
              <Input 
                type="email"
                placeholder="Customer Email" 
                className="bg-black/50 border-gray-600 text-white"
                value={newTestimonial.customerEmail}
                onChange={(e) => setNewTestimonial(prev => ({ ...prev, customerEmail: e.target.value }))}
              />
              <div className="flex items-center space-x-2">
                <label className="text-white text-sm">Rating:</label>
                <select
                  value={newTestimonial.rating}
                  onChange={(e) => setNewTestimonial(prev => ({ ...prev, rating: parseInt(e.target.value) }))}
                  className="px-3 py-2 bg-black/50 border border-gray-600 rounded-md text-white focus:border-luxury-gold focus:outline-none flex-1"
                >
                  {[1, 2, 3, 4, 5].map(rating => (
                    <option key={rating} value={rating} className="bg-black">
                      {rating} Star{rating !== 1 ? 's' : ''}
                    </option>
                  ))}
                </select>
              </div>
              <Textarea 
                placeholder="Review Text" 
                className="bg-black/50 border-gray-600 text-white md:col-span-2"
                value={newTestimonial.review}
                onChange={(e) => setNewTestimonial(prev => ({ ...prev, review: e.target.value }))}
                rows={4}
              />
              <div className="md:col-span-2">
                <label className="flex items-center space-x-2 text-white">
                  <input
                    type="checkbox"
                    checked={newTestimonial.isApproved}
                    onChange={(e) => setNewTestimonial(prev => ({ ...prev, isApproved: e.target.checked }))}
                    className="rounded"
                  />
                  <span>Approved for display</span>
                </label>
              </div>
            </div>
            <div className="flex gap-4 mt-6">
              <Button 
                className="flex-1 bg-gradient-to-r from-luxury-gold to-soft-pink text-black"
                onClick={handleAddTestimonial}
              >
                Save Testimonial
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

      {editingTestimonial && (
        <Card className="glass-morphism border-luxury-gold/30">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Edit Testimonial</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2 md:col-span-2">
                <label className="text-white text-sm">Rating:</label>
                <select
                  value={editingTestimonial.rating}
                  onChange={(e) => setEditingTestimonial(prev => prev ? ({ ...prev, rating: parseInt(e.target.value) }) : null)}
                  className="px-3 py-2 bg-black/50 border border-gray-600 rounded-md text-white focus:border-luxury-gold focus:outline-none"
                >
                  {[1, 2, 3, 4, 5].map(rating => (
                    <option key={rating} value={rating} className="bg-black">
                      {rating} Star{rating !== 1 ? 's' : ''}
                    </option>
                  ))}
                </select>
              </div>
              <Textarea 
                placeholder="Review Text" 
                className="bg-black/50 border-gray-600 text-white md:col-span-2"
                value={editingTestimonial.review}
                onChange={(e) => setEditingTestimonial(prev => prev ? ({ ...prev, review: e.target.value }) : null)}
                rows={4}
              />
              <div className="md:col-span-2">
                <label className="flex items-center space-x-2 text-white">
                  <input
                    type="checkbox"
                    checked={editingTestimonial.isApproved}
                    onChange={(e) => setEditingTestimonial(prev => prev ? ({ ...prev, isApproved: e.target.checked }) : null)}
                    className="rounded"
                  />
                  <span>Approved for display</span>
                </label>
              </div>
            </div>
            <div className="flex gap-4 mt-6">
              <Button 
                className="flex-1 bg-gradient-to-r from-luxury-gold to-soft-pink text-black"
                onClick={handleEditTestimonial}
              >
                Update Testimonial
              </Button>
              <Button 
                variant="outline"
                className="flex-1 border-gray-600"
                onClick={() => setEditingTestimonial(null)}
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
      ) : testimonials.length === 0 ? (
        <Card className="glass-morphism border-gray-600">
          <CardContent className="p-12 text-center">
            <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold text-white mb-2">No Testimonials</h3>
            <p className="text-gray-400">Start by adding your first testimonial above.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="glass-morphism border-gray-600 hover:border-luxury-gold transition-colors">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    {renderStars(testimonial.rating)}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={`${testimonial.isApproved ? 'bg-green-500' : 'bg-yellow-500'} text-white`}>
                      {testimonial.isApproved ? 'Approved' : 'Pending'}
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleApproval(testimonial.id, !testimonial.isApproved)}
                      className={`p-1 h-8 w-8 ${testimonial.isApproved ? 'hover:bg-yellow-500' : 'hover:bg-green-500'}`}
                    >
                      {testimonial.isApproved ? <X className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
                
                <blockquote className="text-gray-300 mb-4 italic border-l-4 border-luxury-gold pl-4">
                  "{testimonial.review}"
                </blockquote>
                
                <div className="space-y-2 mb-4">
                  {testimonial.customerFirstName && (
                    <div className="flex items-center text-sm">
                      <User className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="text-white">
                        {testimonial.customerFirstName} {testimonial.customerLastName}
                      </span>
                    </div>
                  )}
                  {testimonial.customerEmail && (
                    <div className="flex items-center text-sm">
                      <Mail className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="text-gray-400">{testimonial.customerEmail}</span>
                    </div>
                  )}
                  {testimonial.serviceName && (
                    <div className="flex items-center text-sm">
                      <Star className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="text-luxury-gold">{testimonial.serviceName}</span>
                    </div>
                  )}
                  <div className="text-xs text-gray-500">
                    Added: {new Date(testimonial.createdAt).toLocaleDateString()}
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1 glass-morphism border-gray-600 hover:bg-luxury-gold hover:text-black"
                    onClick={() => setEditingTestimonial(testimonial)}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1 glass-morphism border-gray-600 hover:bg-red-600 hover:border-red-600"
                    onClick={() => handleDeleteTestimonial(testimonial.id)}
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