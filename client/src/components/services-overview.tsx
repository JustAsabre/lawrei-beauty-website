import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, DollarSign, Users } from "lucide-react";
import { useServices } from "@/hooks/use-site-content";

interface Service {
  id: string;
  name: string;
  description: string;
  category: string;
  duration: number;
  price: number;
  imageUrl?: string;
}

export default function ServicesOverview() {
  // Fetch real services from backend using centralized hook
  const { data: services = [], isLoading } = useServices();

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      facial: "bg-blue-500",
      massage: "bg-green-500",
      manicure: "bg-pink-500",
      pedicure: "bg-purple-500",
      hair: "bg-orange-500",
      makeup: "bg-red-500",
      waxing: "bg-yellow-500",
      other: "bg-gray-500"
    };
    return colors[category] || "bg-gray-500";
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      facial: "✨",
      massage: "💆‍♀️",
      manicure: "💅",
      pedicure: "🦶",
      hair: "💇‍♀️",
      makeup: "💄",
      waxing: "🪒",
      other: "🌟"
    };
    return icons[category] || "🌟";
  };

  if (isLoading) {
    return (
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold mb-4 gradient-text">Our Premium Services</h2>
            <p className="text-gray-400">Loading our luxury beauty services...</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="glass-morphism border-gray-600 animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-600 rounded w-3/4 mb-4"></div>
                  <div className="h-3 bg-gray-600 rounded w-full mb-2"></div>
                  <div className="h-3 bg-gray-600 rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="services" className="py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl font-bold mb-4 gradient-text">Our Premium Services</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Experience luxury beauty treatments with our premium services. Each service is designed to enhance your natural beauty 
            and provide a relaxing, professional experience.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service: Service) => (
            <Card key={service.id} className="glass-morphism border-gray-600 hover:border-luxury-gold transition-all duration-300 hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Badge className={`${getCategoryColor(service.category)} text-white`}>
                    {getCategoryIcon(service.category)} {service.category}
                  </Badge>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-luxury-gold fill-current" />
                    <span className="text-sm text-gray-300">Premium</span>
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold mb-3 text-white">{service.name}</h3>
                <p className="text-gray-400 mb-4 line-clamp-3">{service.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-sm text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>{service.duration} min</span>
                  </div>
                  <div className="text-luxury-gold font-semibold text-lg">
                    ${(service.price / 100).toFixed(2)}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <p className="text-gray-400 mb-4">
            All services include professional consultation and premium products
          </p>
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-400">
            <div className="flex items-center space-x-2">
              <Star className="w-4 h-4 text-luxury-gold" />
              <span>Premium Quality</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-luxury-gold" />
              <span>Flexible Scheduling</span>
            </div>
            <div className="flex items-center space-x-2">
              <DollarSign className="w-4 h-4 text-luxury-gold" />
              <span>Competitive Pricing</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
