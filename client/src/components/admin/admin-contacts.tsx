import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Filter, 
  MessageSquare, 
  User, 
  Phone, 
  Mail, 
  Eye, 
  Reply, 
  Trash2,
  Clock,
  CheckCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  inquiryType: string;
  message: string;
  createdAt: string;
  status?: "new" | "read" | "replied" | "archived";
}

export default function AdminContacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [inquiryFilter, setInquiryFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchContacts();
  }, []);

  useEffect(() => {
    filterContacts();
  }, [contacts, searchTerm, statusFilter, inquiryFilter]);

  const fetchContacts = async () => {
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

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'https://lawrei-beauty-website.onrender.com'}/contacts`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        // Add default status for contacts that don't have one
        const contactsWithStatus = data.map((contact: any) => ({
          ...contact,
          status: contact.status || "new"
        }));
        setContacts(contactsWithStatus);
      } else {
        throw new Error('Failed to fetch contacts');
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
      toast({
        title: "Error",
        description: "Failed to fetch contacts from database",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };



  const filterContacts = () => {
    let filtered = contacts;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(contact =>
        contact.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.message.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(contact => contact.status === statusFilter);
    }

    // Inquiry type filter
    if (inquiryFilter !== "all") {
      filtered = filtered.filter(contact => contact.inquiryType === inquiryFilter);
    }

    setFilteredContacts(filtered);
  };

  const updateContactStatus = async (contactId: string, newStatus: string) => {
    try {
      setContacts(prev => prev.map(contact => 
        contact.id === contactId 
          ? { ...contact, status: newStatus as any }
          : contact
      ));
      
      toast({
        title: "Status Updated",
        description: `Contact status changed to ${newStatus}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update contact status",
        variant: "destructive",
      });
    }
  };

  const deleteContact = async (contactId: string) => {
    if (!confirm("Are you sure you want to delete this contact message?")) return;

    try {
      setContacts(prev => prev.filter(contact => contact.id !== contactId));
      
      toast({
        title: "Contact Deleted",
        description: "The contact message has been removed",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete contact message",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      new: { color: "bg-blue-500", text: "New" },
      read: { color: "bg-yellow-500", text: "Read" },
      replied: { color: "bg-green-500", text: "Replied" },
      archived: { color: "bg-gray-500", text: "Archived" }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.new;
    
    return (
      <Badge className={`${config.color} text-white`}>
        {config.text}
      </Badge>
    );
  };

  const getInquiryTypeColor = (type: string) => {
    const typeColors: { [key: string]: string } = {
      "Bridal Makeup Inquiry": "text-pink-400",
      "Photoshoot Booking": "text-blue-400",
      "Special Event": "text-purple-400",
      "General Question": "text-gray-400"
    };
    return typeColors[type] || "text-gray-400";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Clock className="w-8 h-8 mx-auto mb-2 text-luxury-gold animate-spin" />
          <p className="text-gray-400">Loading contacts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-display font-bold text-white">Contact Messages</h2>
          <p className="text-gray-400">Manage all client inquiries and messages</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-400">
            {filteredContacts.length} of {contacts.length} messages
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
                placeholder="Search messages..."
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
                <option value="new">New</option>
                <option value="read">Read</option>
                <option value="replied">Replied</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <select
                value={inquiryFilter}
                onChange={(e) => setInquiryFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-black/50 border border-gray-600 rounded-md text-white focus:border-luxury-gold focus:outline-none"
              >
                <option value="all">All Types</option>
                <option value="Bridal Makeup Inquiry">Bridal</option>
                <option value="Photoshoot Booking">Photoshoot</option>
                <option value="Special Event">Special Event</option>
                <option value="General Question">General</option>
              </select>
            </div>
            
            <Button
              onClick={fetchContacts}
              className="bg-gradient-to-r from-luxury-gold to-soft-pink text-black hover:opacity-90"
            >
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Contacts List */}
      <div className="space-y-4">
        {filteredContacts.length === 0 ? (
          <Card className="glass-morphism border-gray-600">
            <CardContent className="p-12 text-center">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold text-white mb-2">No messages found</h3>
              <p className="text-gray-400">
                {searchTerm || statusFilter !== "all" || inquiryFilter !== "all"
                  ? "Try adjusting your search or filters" 
                  : "No contact messages have been received yet"
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredContacts.map((contact) => (
            <Card key={contact.id} className="glass-morphism border-gray-600 hover:border-luxury-gold transition-colors">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between space-y-4 lg:space-y-0">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-white">
                        {contact.firstName} {contact.lastName}
                      </h3>
                      {getStatusBadge(contact.status || "new")}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-300">{contact.email}</span>
                      </div>
                      {contact.phone && (
                        <div className="flex items-center space-x-2">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-300">{contact.phone}</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-300">
                          {new Date(contact.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`text-sm font-medium ${getInquiryTypeColor(contact.inquiryType)}`}>
                          {contact.inquiryType}
                        </span>
                      </div>
                    </div>
                    
                    <div className="bg-black/30 p-4 rounded-lg">
                      <p className="text-gray-300 text-sm leading-relaxed">
                        {contact.message}
                      </p>
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
                      onClick={() => updateContactStatus(contact.id, "replied")}
                      className="glass-morphism border-gray-600 hover:bg-green-600 hover:border-green-600"
                    >
                      <Reply className="w-4 h-4" />
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteContact(contact.id)}
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
                      onClick={() => updateContactStatus(contact.id, "read")}
                      className="text-blue-400 border-blue-400 hover:bg-blue-400 hover:text-black"
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Mark Read
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateContactStatus(contact.id, "archived")}
                      className="text-gray-400 border-gray-400 hover:bg-gray-400 hover:text-black"
                    >
                      Archive
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
