import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { CheckCircle, Loader2, Calendar, Clock, DollarSign, User, Mail, Phone } from "lucide-react";
import type { InsertBooking } from "@shared/schema";

interface Service {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  category: string;
  imageUrl?: string;
}

const timeSlots = ["9:00 AM", "10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"];

export default function BookingSection() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    service: "",
    preferredDate: "",
    preferredTime: "",
    specialRequests: ""
  });

  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch real services from backend
  const { data: services = [], isLoading: servicesLoading } = useQuery({
    queryKey: ["/api/services"],
    queryFn: async () => {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'https://lawrei-beauty-website.onrender.com'}/api/services`);
      if (!response.ok) throw new Error('Failed to fetch services');
      return response.json();
    }
  });

  // Calculate form completion progress
  const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'service', 'preferredDate', 'preferredTime'];
  const completedFields = requiredFields.filter(field => formData[field as keyof typeof formData]);
  const progressPercentage = (completedFields.length / requiredFields.length) * 100;

  const bookingMutation = useMutation({
    mutationFn: async (bookingData: any) => {
      // First create customer
      const customerResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'https://lawrei-beauty-website.onrender.com'}/api/customers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone
        })
      });

      if (!customerResponse.ok) {
        throw new Error('Failed to create customer profile');
      }

      const customer = await customerResponse.json();

      // Get the selected service for price calculation
      const selectedService = services.find((s: Service) => s.id === formData.service);
      if (!selectedService) {
        throw new Error('Selected service not found');
      }

      // Then create booking
      const bookingResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'https://lawrei-beauty-website.onrender.com'}/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: customer.id,
          serviceId: formData.service,
          appointmentDate: new Date(formData.preferredDate),
          startTime: new Date(`${formData.preferredDate}T${formData.preferredTime}`),
          endTime: new Date(`${formData.preferredDate}T${formData.preferredTime}`),
          notes: formData.specialRequests,
          totalPrice: selectedService.price
        })
      });

      if (!bookingResponse.ok) {
        throw new Error('Failed to create booking');
      }

      return bookingResponse.json();
    },
    onSuccess: () => {
      setIsSuccess(true);
      toast({
        title: "Booking Confirmed! 🎉",
        description: "Thank you for booking with Lawrei Beauty. We'll contact you soon to confirm details.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/bookings"] });
      
      // Reset success state after 5 seconds
      setTimeout(() => setIsSuccess(false), 5000);
    },
    onError: (error) => {
      toast({
        title: "Booking Failed",
        description: error.message || "There was an error submitting your booking. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Enhanced validation
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
    
    if (missingFields.length > 0) {
      toast({
        title: "Missing Information",
        description: `Please fill in: ${missingFields.map(field => field.replace(/([A-Z])/g, ' $1').toLowerCase()).join(', ')}`,
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

    // Phone validation
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phoneRegex.test(formData.phone.replace(/\D/g, ''))) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid phone number.",
        variant: "destructive",
      });
      return;
    }

    // Transform form data to match API structure
    const selectedService = services.find((s: Service) => s.id === formData.service);
    if (!selectedService) {
      toast({
        title: "Invalid Service",
        description: "Please select a valid service.",
        variant: "destructive",
      });
      return;
    }

    const bookingData = {
      customerId: `temp-${Date.now()}`, // Will be replaced with real customer ID
      serviceId: formData.service,
      appointmentDate: new Date(formData.preferredDate),
      startTime: new Date(`${formData.preferredDate}T${formData.preferredTime}`),
      endTime: new Date(`${formData.preferredDate}T${formData.preferredTime}`),
      notes: formData.specialRequests,
      totalPrice: selectedService.price
    };

    bookingMutation.mutate(bookingData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      service: "",
      preferredDate: "",
      preferredTime: "",
      specialRequests: ""
    });
    setIsSuccess(false);
  };

  if (isSuccess) {
    const selectedService = services.find((s: Service) => s.id === formData.service);
    return (
      <section id="booking" className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass-morphism rounded-2xl p-12 border-luxury-gold/30">
            <CheckCircle className="w-20 h-20 mx-auto mb-6 text-luxury-gold" />
            <h2 className="font-display text-3xl font-bold mb-4 gradient-text">
              Booking Confirmed! 🎉
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Thank you for choosing Lawrei Beauty! We've received your booking and will contact you within 24 hours to confirm all the details.
            </p>
            <div className="space-y-4 mb-8 text-left max-w-md mx-auto">
              <div className="flex items-center space-x-3">
                <User className="w-5 h-5 text-luxury-gold" />
                <span className="text-gray-300">Name: {formData.firstName} {formData.lastName}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-luxury-gold" />
                <span className="text-gray-300">Email: {formData.email}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-luxury-gold" />
                <span className="text-gray-300">Phone: {formData.phone}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-luxury-gold" />
                <span className="text-gray-300">Date: {formData.preferredDate}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-luxury-gold" />
                <span className="text-gray-300">Time: {formData.preferredTime}</span>
              </div>
              <div className="flex items-center space-x-3">
                <DollarSign className="w-5 h-5 text-luxury-gold" />
                <span className="text-gray-300">Service: {selectedService?.name}</span>
              </div>
            </div>
            <Button 
              onClick={resetForm}
              className="px-8 py-3 bg-gradient-to-r from-luxury-gold to-soft-pink text-black font-semibold hover:opacity-90"
            >
              Book Another Session
            </Button>
          </div>
        </div>
      </section>
    );
  }

  if (servicesLoading) {
    return (
      <section id="booking" className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <Loader2 className="w-12 h-12 mx-auto mb-4 text-luxury-gold animate-spin" />
          <p className="text-gray-400">Loading our premium services...</p>
        </div>
      </section>
    );
  }

  return (
    <section id="booking" className="py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="font-display text-3xl font-bold text-center mb-12 gradient-text">Book Your Premium Session</h2>
        
        <Card className="booking-card glass-morphism border-none">
          <CardContent className="p-8">
            {/* Progress Indicator */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Form Progress</span>
                <span className="text-sm text-luxury-gold font-medium">{Math.round(progressPercentage)}% Complete</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Service Selection */}
              <div>
                <h3 className="font-display text-xl font-semibold mb-6">Choose Your Premium Service</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {services.map((service: Service) => (
                    <div
                      key={service.id}
                      className={`p-4 border rounded-xl cursor-pointer transition-all duration-300 ${
                        formData.service === service.id
                          ? "border-luxury-gold bg-luxury-gold/10 scale-105"
                          : "border-gray-600 hover:border-luxury-gold hover:scale-102"
                      }`}
                      onClick={() => handleInputChange("service", service.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold">{service.name}</h4>
                          <p className="text-sm text-gray-400">{service.duration} minutes</p>
                          <p className="text-xs text-gray-500 mt-1">{service.description}</p>
                        </div>
                        <span className="text-luxury-gold font-semibold">
                          ${(service.price / 100).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Date & Time Selection */}
              <div>
                <h3 className="font-display text-xl font-semibold mb-6">Select Date & Time</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="date" className="block text-sm font-medium mb-2">Preferred Date *</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.preferredDate}
                      onChange={(e) => handleInputChange("preferredDate", e.target.value)}
                      className="bg-black/50 border-gray-600 focus:border-luxury-gold"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div>
                    <Label htmlFor="time" className="block text-sm font-medium mb-2">Preferred Time *</Label>
                    <Select value={formData.preferredTime} onValueChange={(value) => handleInputChange("preferredTime", value)}>
                      <SelectTrigger className="bg-black/50 border-gray-600 focus:border-luxury-gold">
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((time) => (
                          <SelectItem key={time} value={time}>{time}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="font-display text-xl font-semibold mb-6">Your Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName" className="block text-sm font-medium mb-2">First Name *</Label>
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="Enter your first name"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      className="bg-black/50 border-gray-600 focus:border-luxury-gold"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="block text-sm font-medium mb-2">Last Name *</Label>
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Enter your last name"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      className="bg-black/50 border-gray-600 focus:border-luxury-gold"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="block text-sm font-medium mb-2">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="(555) 123-4567"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className="bg-black/50 border-gray-600 focus:border-luxury-gold"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="email" className="block text-sm font-medium mb-2">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="bg-black/50 border-gray-600 focus:border-luxury-gold"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="specialRequests" className="block text-sm font-medium mb-2">Special Requests</Label>
                    <Textarea
                      id="specialRequests"
                      rows={3}
                      placeholder="Any specific looks, skin concerns, or requirements..."
                      value={formData.specialRequests}
                      onChange={(e) => handleInputChange("specialRequests", e.target.value)}
                      className="bg-black/50 border-gray-600 focus:border-luxury-gold resize-none"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  type="submit"
                  disabled={bookingMutation.isPending}
                  className="px-8 py-3 bg-gradient-to-r from-luxury-gold to-soft-pink text-black font-semibold hover:opacity-90 disabled:opacity-50"
                >
                  {bookingMutation.isPending ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Confirming...
                    </>
                  ) : (
                    "Confirm Premium Booking"
                  )}
                </Button>
                <Button 
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                  className="px-8 py-3 glass-morphism border-gray-600 font-semibold hover:bg-luxury-gold hover:text-black"
                >
                  Start Over
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
