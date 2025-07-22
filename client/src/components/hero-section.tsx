import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

export default function HeroSection() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=1200" 
          alt="Professional makeup artist working on client" 
          className="w-full h-full object-cover opacity-40" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div>
      </div>
      
      <div className="relative z-10 text-center px-6 animate-fade-in">
        <h1 className="font-display text-4xl md:text-6xl font-bold mb-4 animate-float">
          <span className="gradient-text">Lawrei's Makeup</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-md mx-auto">
          Transforming beauty, one face at a time. Professional makeup artistry for your special moments.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={() => scrollToSection('booking')}
            className="bg-gradient-to-r from-luxury-gold to-soft-pink text-black px-8 py-3 font-semibold animate-glow hover:opacity-90"
          >
            Book Session
          </Button>
          <Button 
            variant="outline"
            onClick={() => scrollToSection('portfolio')}
            className="glass-morphism px-8 py-3 font-semibold border-luxury-gold/30 text-white hover:bg-luxury-gold hover:text-black"
          >
            View Portfolio
          </Button>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ChevronDown className="text-luxury-gold text-2xl" />
      </div>
    </section>
  );
}
