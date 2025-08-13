import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Star, Sparkles, Heart, Camera, Users, Calendar } from "lucide-react";

const services = [
  {
    id: "1",
    title: "Classic Facial",
    description: "Deep cleansing facial with natural products for radiant, healthy skin.",
    duration: "60 minutes",
    price: "$75.00",
    features: ["Deep cleansing", "Natural products", "Skin analysis", "Moisturizing treatment"],
    icon: Heart,
    popular: true
  },
  {
    id: "2",
    title: "Swedish Massage",
    description: "Relaxing full body massage to relieve tension and promote wellness.",
    duration: "90 minutes",
    price: "$120.00",
    features: ["Full body massage", "Stress relief", "Muscle relaxation", "Aromatherapy oils"],
    icon: Sparkles
  },
  {
    id: "3",
    title: "Gel Manicure",
    description: "Long-lasting gel polish manicure with professional nail care.",
    duration: "45 minutes",
    price: "$45.00",
    features: ["Gel polish", "Nail shaping", "Cuticle care", "Long-lasting finish"],
    icon: Camera
  },
  {
    id: "4",
    title: "Beauty Consultation",
    description: "Personalized beauty advice and product recommendations for your skin type.",
    duration: "30 minutes",
    price: "Free",
    features: ["Skin analysis", "Product recommendations", "Beauty tips", "Follow-up support"],
    icon: Users
  }
];

export default function ServicesOverview() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="services" className="py-20 px-6 bg-gradient-to-b from-black to-rich-black">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6 gradient-text">
            Professional Services
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            From classic facials to relaxing massages, I offer a range of professional beauty and wellness services 
            tailored to your unique needs and preferences.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {services.map((service) => {
            const IconComponent = service.icon;
            return (
              <Card 
                key={service.id} 
                className={`relative overflow-hidden transition-all duration-300 hover:scale-105 ${
                  service.popular 
                    ? 'ring-2 ring-luxury-gold shadow-lg shadow-luxury-gold/20' 
                    : 'glass-morphism border-gray-600'
                }`}
              >
                {service.popular && (
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-luxury-gold to-soft-pink text-black px-3 py-1 text-sm font-semibold rounded-bl-lg">
                    Most Popular
                  </div>
                )}
                
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-luxury-gold to-soft-pink rounded-full flex items-center justify-center">
                    <IconComponent className="w-8 h-8 text-black" />
                  </div>
                  <CardTitle className="text-xl font-display">{service.title}</CardTitle>
                </CardHeader>
                
                <CardContent className="text-center">
                  <p className="text-gray-400 mb-4 text-sm leading-relaxed">
                    {service.description}
                  </p>
                  
                  <div className="flex items-center justify-center space-x-4 mb-4 text-sm">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4 text-luxury-gold" />
                      <span>{service.duration}</span>
                    </div>
                    <div className="text-luxury-gold font-semibold text-lg">
                      {service.price}
                    </div>
                  </div>
                  
                  <ul className="text-left space-y-2 mb-6">
                    {service.features.map((feature, index) => (
                      <li key={index} className="flex items-center space-x-2 text-sm text-gray-300">
                        <Star className="w-3 h-3 text-luxury-gold fill-current flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    onClick={() => scrollToSection('booking')}
                    className={`w-full ${
                      service.popular 
                        ? 'bg-gradient-to-r from-luxury-gold to-soft-pink text-black hover:opacity-90' 
                        : 'glass-morphism border-gray-600 hover:bg-luxury-gold hover:text-black'
                    }`}
                  >
                    Book Now
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="glass-morphism rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="font-display text-2xl font-semibold mb-4">
              Ready to Transform Your Look?
            </h3>
            <p className="text-gray-300 mb-6">
              Book your consultation today and let's create the perfect beauty experience for your needs.
            </p>
            <Button 
              size="lg"
              onClick={() => scrollToSection('booking')}
              className="px-8 py-3 bg-gradient-to-r from-luxury-gold to-soft-pink text-black font-semibold hover:opacity-90"
            >
              <Calendar className="w-5 h-5 mr-2" />
              Schedule Your Session
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
