import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { CheckCircle, Loader2, Calendar, Clock, DollarSign } from "lucide-react";
import type { InsertBooking } from "@shared/schema";

const services = [
  { id: "1", name: "Classic Facial", duration: "60 minutes", price: 7500, popular: true },
  { id: "2", name: "Swedish Massage", duration: "90 minutes", price: 12000 },
  { id: "3", name: "Gel Manicure", duration: "45 minutes", price: 4500 },
  { id: "4", name: "Beauty Consultation", duration: "30 minutes", price: 0 }
];

const timeSlots = ["9:00 AM", "11:00 AM", "2:00 PM", "4:00 PM"];

export default function BookingSection() {
  const [formData, setFormData] = useState({
    fullName: "",
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

  // Calculate form completion progress
  const requiredFields = ['fullName', 'email', 'phone', 'service', 'preferredDate', 'preferredTime'];
  const completedFields = requiredFields.filter(field => formData[field as keyof typeof formData]);
  const progressPercentage = (completedFields.length / requiredFields.length) * 100;

  const bookingMutation = useMutation({
    mutationFn: (bookingData: InsertBooking) => 
      apiRequest("POST", "/api/bookings", bookingData),
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
    const selectedService = services.find(s => s.id === formData.service);
    if (!selectedService) {
      toast({
        title: "Invalid Service",
        description: "Please select a valid service.",
        variant: "destructive",
      });
      return;
    }

    const [firstName, ...lastNameParts] = formData.fullName.trim().split(' ');
    const lastName = lastNameParts.join(' ') || '';

    const bookingData: InsertBooking = {
      customerId: `temp-${Date.now()}`, // Temporary ID for mock data
      serviceId: formData.service,
      appointmentDate: new Date(formData.preferredDate),
      startTime: new Date(`${formData.preferredDate}T${formData.preferredTime}`),
      endTime: new Date(`${formData.preferredDate}T${formData.preferredTime}`), // Will be calculated based on service duration
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
      fullName: "",
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
    const selectedService = services.find(s => s.id === formData.service);
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

  return (
    <section id="booking" className="py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="font-display text-3xl font-bold text-center mb-12 gradient-text">Book Your Session</h2>
        
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
                <h3 className="font-display text-xl font-semibold mb-6">Choose Your Service</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {services.map((service) => (
                    <div
                      key={service.id}
                      className={`p-4 border rounded-xl cursor-pointer transition-all duration-300 ${
                        formData.service === service.id
                          ? "border-luxury-gold bg-luxury-gold/10 scale-105"
                          : "border-gray-600 hover:border-luxury-gold hover:scale-102"
                      } ${service.popular ? 'ring-2 ring-luxury-gold/50' : ''}`}
                      onClick={() => handleInputChange("service", service.id)}
                    >
                      {service.popular && (
                        <div className="text-xs bg-gradient-to-r from-luxury-gold to-soft-pink text-black px-2 py-1 rounded-full font-semibold mb-2 inline-block">
                          Most Popular
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold">{service.name}</h4>
                          <p className="text-sm text-gray-400">{service.duration}</p>
                        </div>
                        <span className="text-luxury-gold font-semibold">
                          {service.price === 0 ? 'Free' : `$${(service.price / 100).toFixed(2)}`}
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
                    <Label htmlFor="fullName" className="block text-sm font-medium mb-2">Full Name *</Label>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange("fullName", e.target.value)}
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
                      placeholder="Any specific looks or requirements..."
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
                    "Confirm Booking"
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
