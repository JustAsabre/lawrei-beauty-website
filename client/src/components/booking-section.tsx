import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { InsertBooking } from "@shared/schema";

const services = [
  { id: "bridal", name: "Bridal Makeup", duration: "2-3 hours", price: "$150" },
  { id: "photoshoot", name: "Photoshoot Makeup", duration: "1-2 hours", price: "$100" },
  { id: "special", name: "Special Event", duration: "1-1.5 hours", price: "$80" },
  { id: "consultation", name: "Consultation", duration: "30 minutes", price: "Free" }
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

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const bookingMutation = useMutation({
    mutationFn: (bookingData: InsertBooking) => 
      apiRequest("POST", "/api/bookings", bookingData),
    onSuccess: () => {
      toast({
        title: "Booking Confirmed!",
        description: "Thank you for booking with Lawrei's Makeup. We'll contact you soon to confirm details.",
      });
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        service: "",
        preferredDate: "",
        preferredTime: "",
        specialRequests: ""
      });
      queryClient.invalidateQueries({ queryKey: ["/api/bookings"] });
    },
    onError: () => {
      toast({
        title: "Booking Failed",
        description: "There was an error submitting your booking. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.email || !formData.phone || !formData.service || !formData.preferredDate || !formData.preferredTime) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    bookingMutation.mutate(formData);
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
  };

  return (
    <section id="booking" className="py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="font-display text-3xl font-bold text-center mb-12 gradient-text">Book Your Session</h2>
        
        <Card className="booking-card glass-morphism border-none">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Service Selection */}
              <div>
                <h3 className="font-display text-xl font-semibold mb-6">Choose Your Service</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {services.map((service) => (
                    <div
                      key={service.id}
                      className={`p-4 border rounded-xl cursor-pointer transition-colors ${
                        formData.service === service.id
                          ? "border-luxury-gold bg-luxury-gold/10"
                          : "border-gray-600 hover:border-luxury-gold"
                      }`}
                      onClick={() => handleInputChange("service", service.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold">{service.name}</h4>
                          <p className="text-sm text-gray-400">{service.duration}</p>
                        </div>
                        <span className="text-luxury-gold font-semibold">{service.price}</span>
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
                    <Label htmlFor="date" className="block text-sm font-medium mb-2">Preferred Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.preferredDate}
                      onChange={(e) => handleInputChange("preferredDate", e.target.value)}
                      className="bg-black/50 border-gray-600 focus:border-luxury-gold"
                    />
                  </div>
                  <div>
                    <Label htmlFor="time" className="block text-sm font-medium mb-2">Preferred Time</Label>
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
                  className="px-8 py-3 bg-gradient-to-r from-luxury-gold to-soft-pink text-black font-semibold hover:opacity-90"
                >
                  {bookingMutation.isPending ? "Confirming..." : "Confirm Booking"}
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
