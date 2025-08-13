import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Filter, 
  Calendar, 
  User, 
  Phone, 
  Mail, 
  Eye, 
  Edit, 
  Trash2,
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Booking {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  service: string;
  preferredDate: string;
  preferredTime: string;
  specialRequests?: string;
  createdAt: string;
  status?: "pending" | "confirmed" | "cancelled" | "completed";
}

export default function AdminBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    filterBookings();
  }, [bookings, searchTerm, statusFilter]);

  const fetchBookings = async () => {
    try {
      // For now, using mock data since the real booking system isn't fully connected yet
      // In production, this would fetch from your actual database
      const mockBookings: Booking[] = [
        {
          id: 1,
          fullName: "Sarah Johnson",
          email: "sarah@example.com",
          phone: "(555) 123-4567",
          service: "Bridal Makeup",
          preferredDate: "2024-06-15",
          preferredTime: "9:00 AM",
          specialRequests: "Natural look with pink lips",
          createdAt: new Date().toISOString(),
          status: "pending"
        },
        {
          id: 2,
          fullName: "Emily Rodriguez",
          email: "emily@example.com",
          phone: "(555) 987-6543",
          service: "Photoshoot Makeup",
          preferredDate: "2024-06-20",
          preferredTime: "2:00 PM",
          specialRequests: "Glamorous evening look",
          createdAt: new Date().toISOString(),
          status: "confirmed"
        },
        {
          id: 3,
          fullName: "Jessica Chen",
          email: "jessica@example.com",
          phone: "(555) 456-7890",
          service: "Special Event Makeup",
          preferredDate: "2024-07-01",
          preferredTime: "6:00 PM",
          specialRequests: "Bold and dramatic look",
          createdAt: new Date().toISOString(),
          status: "completed"
        }
      ];
      
      setBookings(mockBookings);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch bookings",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };



  const filterBookings = () => {
    let filtered = bookings;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(booking =>
        booking.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.service.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(booking => booking.status === statusFilter);
    }

    setFilteredBookings(filtered);
  };

  const updateBookingStatus = async (bookingId: number, newStatus: string) => {
    try {
      // In a real app, this would call an API endpoint
      setBookings(prev => prev.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: newStatus as any }
          : booking
      ));
      
      toast({
        title: "Status Updated",
        description: `Booking status changed to ${newStatus}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update booking status",
        variant: "destructive",
      });
    }
  };

  const deleteBooking = async (bookingId: number) => {
    if (!confirm("Are you sure you want to delete this booking?")) return;

    try {
      // In a real app, this would call an API endpoint
      setBookings(prev => prev.filter(booking => booking.id !== bookingId));
      
      toast({
        title: "Booking Deleted",
        description: "The booking has been removed",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete booking",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: "bg-yellow-500", text: "Pending" },
      confirmed: { color: "bg-green-500", text: "Confirmed" },
      cancelled: { color: "bg-red-500", text: "Cancelled" },
      completed: { color: "bg-blue-500", text: "Completed" }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    
    return (
      <Badge className={`${config.color} text-white`}>
        {config.text}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Clock className="w-8 h-8 mx-auto mb-2 text-luxury-gold animate-spin" />
          <p className="text-gray-400">Loading bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-display font-bold text-white">Bookings Management</h2>
          <p className="text-gray-400">Manage all client bookings and appointments</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-400">
            {filteredBookings.length} of {bookings.length} bookings
          </span>
        </div>
      </div>

      {/* Filters */}
      <Card className="glass-morphism border-gray-600">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search bookings..."
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
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            
            <Button
              onClick={fetchBookings}
              className="bg-gradient-to-r from-luxury-gold to-soft-pink text-black hover:opacity-90"
            >
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.length === 0 ? (
          <Card className="glass-morphism border-gray-600">
            <CardContent className="p-12 text-center">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold text-white mb-2">No bookings found</h3>
              <p className="text-gray-400">
                {searchTerm || statusFilter !== "all" 
                  ? "Try adjusting your search or filters" 
                  : "No bookings have been made yet"
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredBookings.map((booking) => (
            <Card key={booking.id} className="glass-morphism border-gray-600 hover:border-luxury-gold transition-colors">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-white">{booking.fullName}</h3>
                      {getStatusBadge(booking.status || "pending")}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-300">{booking.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-300">{booking.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-300">
                          {new Date(booking.preferredDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-300">{booking.preferredTime}</span>
                      </div>
                    </div>
                    
                    <div>
                      <span className="text-sm text-gray-400">Service: </span>
                      <span className="text-sm text-luxury-gold font-medium">{booking.service}</span>
                      {booking.specialRequests && (
                        <div className="mt-2">
                          <span className="text-sm text-gray-400">Special Requests: </span>
                          <span className="text-sm text-gray-300">{booking.specialRequests}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 lg:flex-col lg:space-x-0 lg:space-y-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="glass-morphism border-gray-600 hover:bg-luxury-gold hover:text-black"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      className="glass-morphism border-gray-600 hover:bg-luxury-gold hover:text-black"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteBooking(booking.id)}
                      className="glass-morphism border-gray-600 hover:bg-red-600 hover:border-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                {/* Status Update Buttons */}
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateBookingStatus(booking.id, "confirmed")}
                      className="text-green-400 border-green-400 hover:bg-green-400 hover:text-black"
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Confirm
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateBookingStatus(booking.id, "cancelled")}
                      className="text-red-400 border-red-400 hover:bg-red-400 hover:text-black"
                    >
                      <XCircle className="w-4 h-4 mr-1" />
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateBookingStatus(booking.id, "completed")}
                      className="text-blue-400 border-blue-400 hover:bg-blue-400 hover:text-black"
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Mark Complete
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
