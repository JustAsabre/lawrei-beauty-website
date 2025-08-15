import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Phone, Mail, MapPin, Instagram, Facebook, Loader2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { InsertContact } from "@shared/schema";

const inquiryTypes = [
  "Bridal Makeup Inquiry",
  "Photoshoot Booking",
  "Special Event",
  "Luxury Facial Consultation",
  "Massage Therapy",
  "General Question",
  "Partnership Opportunity"
];

export default function ContactSection() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    inquiryType: "",
    message: ""
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const contactMutation = useMutation({
    mutationFn: (contactData: InsertContact) => 
      apiRequest("POST", "/api/contacts", contactData),
    onSuccess: () => {
      toast({
        title: "Message Sent Successfully! ✨",
        description: "Thank you for reaching out. We'll get back to you within 24 hours with a personalized response.",
      });
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        inquiryType: "",
        message: ""
      });
      queryClient.invalidateQueries({ queryKey: ["/api/contacts"] });
    },
    onError: (error) => {
      toast({
        title: "Message Failed to Send",
        description: error.message || "There was an error sending your message. Please try again or contact us directly.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Enhanced validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.inquiryType || !formData.message) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields to send your message.",
        variant: "destructive",
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    // Phone validation (optional but if provided, must be valid)
    if (formData.phone) {
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      if (!phoneRegex.test(formData.phone.replace(/\D/g, ''))) {
        toast({
          title: "Invalid Phone Number",
          description: "Please enter a valid phone number or leave it blank.",
          variant: "destructive",
        });
        return;
      }
    }

    // Message length validation
    if (formData.message.length < 10) {
      toast({
        title: "Message Too Short",
        description: "Please provide more details in your message (at least 10 characters).",
        variant: "destructive",
      });
      return;
    }

    contactMutation.mutate(formData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <section id="contact" className="py-16 px-6 bg-gradient-to-t from-rich-black to-black">
      <div className="max-w-4xl mx-auto">
        <h2 className="font-display text-3xl font-bold text-center mb-12 gradient-text">Get in Touch</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="animate-slide-up">
            <h3 className="font-display text-xl font-semibold mb-6">Send a Message</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    className="bg-black/50 border-gray-600 focus:border-luxury-gold"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    className="bg-black/50 border-gray-600 focus:border-luxury-gold"
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="contactEmail">Email Address *</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="bg-black/50 border-gray-600 focus:border-luxury-gold"
                  required
                />
              </div>
              <div>
                <Label htmlFor="contactPhone">Phone Number</Label>
                <Input
                  id="contactPhone"
                  type="tel"
                  placeholder="Phone Number (optional)"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="bg-black/50 border-gray-600 focus:border-luxury-gold"
                />
              </div>
              <div>
                <Label>Inquiry Type *</Label>
                <Select value={formData.inquiryType} onValueChange={(value) => handleInputChange("inquiryType", value)}>
                  <SelectTrigger className="bg-black/50 border-gray-600 focus:border-luxury-gold">
                    <SelectValue placeholder="What can I help you with?" />
                  </SelectTrigger>
                  <SelectContent>
                    {inquiryTypes.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="message">Message *</Label>
                <Textarea
                  id="message"
                  rows={4}
                  placeholder="Tell me about your vision, concerns, or questions..."
                  value={formData.message}
                  onChange={(e) => handleInputChange("message", e.target.value)}
                  className="bg-black/50 border-gray-600 focus:border-luxury-gold resize-none"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Minimum 10 characters</p>
              </div>
              <Button 
                type="submit"
                disabled={contactMutation.isPending}
                className="w-full py-3 bg-gradient-to-r from-luxury-gold to-soft-pink text-black font-semibold hover:opacity-90 disabled:opacity-50"
              >
                {contactMutation.isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Message"
                )}
              </Button>
            </form>
          </div>

          <div className="animate-slide-up">
            <h3 className="font-display text-xl font-semibold mb-6">Connect With Me</h3>
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-luxury-gold to-soft-pink rounded-full flex items-center justify-center">
                  <Phone className="text-black w-5 h-5" />
                </div>
                <div>
                  <div className="font-semibold">Phone</div>
                  <div className="text-gray-400">(555) 123-4567</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-luxury-gold to-soft-pink rounded-full flex items-center justify-center">
                  <Mail className="text-black w-5 h-5" />
                </div>
                <div>
                  <div className="font-semibold">Email</div>
                  <div className="text-gray-400">hello@lawreibeauty.com</div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-luxury-gold to-soft-pink rounded-full flex items-center justify-center">
                  <MapPin className="text-black w-5 h-5" />
                </div>
                <div>
                  <div className="font-semibold">Location</div>
                  <div className="text-gray-400">Los Angeles, CA</div>
                </div>
              </div>

              <div className="pt-6">
                <div className="font-semibold mb-4">Follow My Work</div>
                <div className="flex space-x-4">
                  <a 
                    href="#" 
                    className="w-12 h-12 glass-morphism rounded-full flex items-center justify-center hover:bg-luxury-gold hover:text-black transition-colors"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                  <a 
                    href="#" 
                    className="w-12 h-12 glass-morphism rounded-full flex items-center justify-center hover:bg-luxury-gold hover:text-black transition-colors"
                  >
                    <Facebook className="w-5 h-5" />
                  </a>
                </div>
              </div>

              <div className="pt-6 p-4 glass-morphism rounded-lg">
                <h4 className="font-semibold mb-2">Response Time</h4>
                <p className="text-sm text-gray-400">
                  I typically respond to all inquiries within 24 hours during business days. 
                  For urgent matters, please call directly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
