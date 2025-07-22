import { Palette, Camera, Star } from "lucide-react";

const services = [
  {
    icon: Palette,
    title: "Bridal Makeup",
    description: "Perfect for your special day with long-lasting, photo-ready results",
    price: "From $150"
  },
  {
    icon: Camera,
    title: "Photo Shoots",
    description: "Professional makeup for photography and social media content",
    price: "From $100"
  },
  {
    icon: Star,
    title: "Special Events",
    description: "Glamorous looks for parties, galas, and celebrations",
    price: "From $80"
  }
];

export default function ServicesOverview() {
  return (
    <section id="services" className="py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-display text-3xl font-bold text-center mb-12 gradient-text">Signature Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <div key={index} className="glass-morphism p-6 rounded-2xl text-center animate-slide-up">
                <div className="w-16 h-16 bg-gradient-to-r from-luxury-gold to-soft-pink rounded-full flex items-center justify-center mx-auto mb-4">
                  <IconComponent className="text-black text-2xl w-8 h-8" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-2">{service.title}</h3>
                <p className="text-gray-400 text-sm mb-4">{service.description}</p>
                <span className="text-luxury-gold font-semibold">{service.price}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
