import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Filter, 
  Star, 
  User, 
  Calendar, 
  Mail, 
  Eye, 
  CheckCircle, 
  Trash2,
  Clock,
  XCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTestimonials } from "@/hooks/use-testimonials";

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
  const [filteredTestimonials, setFilteredTestimonials] = useState<Testimonial[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [ratingFilter, setRatingFilter] = useState<string>("all");
  const { toast } = useToast();
  const { testimonials, isLoading, updateTestimonial, deleteTestimonial } = useTestimonials();

  const filterTestimonials = () => {
    let filtered = testimonials;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(testimonial =>
        testimonial.review.toLowerCase().includes(searchTerm.toLowerCase()) ||
        testimonial.customerFirstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        testimonial.customerLastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        testimonial.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(testimonial => 
        statusFilter === "approved" ? testimonial.isApproved : !testimonial.isApproved
      );
    }

    // Rating filter
    if (ratingFilter !== "all") {
      filtered = filtered.filter(testimonial => 
        testimonial.rating === parseInt(ratingFilter)
      );
    }

    setFilteredTestimonials(filtered);
  };

  const handleApprove = async (testimonialId: string) => {
    try {
      await updateTestimonial({ id: testimonialId, isApproved: true });
      toast({
        title: "Success",
        description: "Testimonial approved successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve testimonial",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (testimonialId: string) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;

    try {
      await deleteTestimonial(testimonialId);
      toast({
        title: "Success",
        description: "Testimonial deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete testimonial",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (isApproved: boolean) => {
    return isApproved ? (
      <Badge className="bg-green-500 text-white">
        Approved
      </Badge>
    ) : (
      <Badge className="bg-yellow-500 text-white">
        Pending
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Clock className="w-8 h-8 mx-auto mb-2 text-luxury-gold animate-spin" />
          <p className="text-gray-400">Loading testimonials...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-display font-bold text-white">Testimonials</h2>
          <p className="text-gray-400">Manage customer reviews and testimonials</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-400">
            {filteredTestimonials.length} of {testimonials.length} testimonials
          </span>
        </div>
      </div>

      {/* Filters */}
      <Card className="glass-morphism border-gray-600">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search testimonials..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-black/50 border-gray-600 focus:border-luxury-gold"
              />
            </div>
            
            <div className="relative">
              <Filter className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-black/50 border border-gray-600 rounded-md text-white focus:border-luxury-gold focus:outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
              </select>
            </div>

            <div className="relative">
              <Star className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <select
                value={ratingFilter}
                onChange={(e) => setRatingFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-black/50 border border-gray-600 rounded-md text-white focus:border-luxury-gold focus:outline-none"
              >
                <option value="all">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>
            
            <Button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-luxury-gold to-soft-pink text-black hover:opacity-90"
            >
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Testimonials List */}
      <div className="space-y-4">
        {filteredTestimonials.length === 0 ? (
          <Card className="glass-morphism border-gray-600">
            <CardContent className="p-12 text-center">
              <Star className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold text-white mb-2">No testimonials found</h3>
              <p className="text-gray-400">
                {searchTerm || statusFilter !== "all" || ratingFilter !== "all"
                  ? "Try adjusting your search or filters" 
                  : "No testimonials have been received yet"
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredTestimonials.map((testimonial) => (
            <Card key={testimonial.id} className="glass-morphism border-gray-600 hover:border-luxury-gold transition-colors">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between space-y-4 lg:space-y-0">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-white">
                        {testimonial.customerFirstName} {testimonial.customerLastName}
                      </h3>
                      {getStatusBadge(testimonial.isApproved)}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-300">{testimonial.customerEmail}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-300">
                          {new Date(testimonial.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        {Array.from({ length: testimonial.rating }).map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-current text-yellow-400" />
                        ))}
                      </div>
                    </div>
                    
                    <div className="bg-black/30 p-4 rounded-lg">
                      <p className="text-gray-300 text-sm leading-relaxed">
                        {testimonial.review}
                      </p>
                    </div>

                    {testimonial.serviceName && (
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-400">Service:</span>
                        <Badge variant="outline" className="text-luxury-gold border-luxury-gold">
                          {testimonial.serviceName}
                        </Badge>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2 lg:flex-col lg:space-x-0 lg:space-y-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="glass-morphism border-gray-600 hover:bg-luxury-gold hover:text-black"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    
                    {!testimonial.isApproved && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleApprove(testimonial.id)}
                        className="glass-morphism border-gray-600 hover:bg-green-600 hover:border-green-600"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </Button>
                    )}
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(testimonial.id)}
                      className="glass-morphism border-gray-600 hover:bg-red-600 hover:border-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}