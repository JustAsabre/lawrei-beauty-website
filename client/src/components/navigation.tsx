import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-morphism">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-luxury-gold to-soft-pink flex items-center justify-center">
            <span className="text-black font-bold text-lg">L</span>
          </div>
          <span className="font-display text-xl font-semibold gradient-text">Lawrei's</span>
        </div>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          <button onClick={() => scrollToSection('home')} className="text-white hover:text-luxury-gold transition-colors">Home</button>
          <button onClick={() => scrollToSection('services')} className="text-white hover:text-luxury-gold transition-colors">Services</button>
          <button onClick={() => scrollToSection('portfolio')} className="text-white hover:text-luxury-gold transition-colors">Portfolio</button>
          <button onClick={() => scrollToSection('about')} className="text-white hover:text-luxury-gold transition-colors">About</button>
          <button onClick={() => scrollToSection('contact')} className="text-white hover:text-luxury-gold transition-colors">Contact</button>
          <Button 
            onClick={() => scrollToSection('booking')}
            className="bg-gradient-to-r from-luxury-gold to-soft-pink text-black hover:opacity-90"
          >
            Book Now
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden glass-morphism"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="h-5 w-5 text-luxury-gold" /> : <Menu className="h-5 w-5 text-luxury-gold" />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden glass-morphism border-t border-white/20">
          <div className="flex flex-col space-y-4 p-4">
            <button onClick={() => scrollToSection('home')} className="text-left text-white hover:text-luxury-gold transition-colors">Home</button>
            <button onClick={() => scrollToSection('services')} className="text-left text-white hover:text-luxury-gold transition-colors">Services</button>
            <button onClick={() => scrollToSection('portfolio')} className="text-left text-white hover:text-luxury-gold transition-colors">Portfolio</button>
            <button onClick={() => scrollToSection('about')} className="text-left text-white hover:text-luxury-gold transition-colors">About</button>
            <button onClick={() => scrollToSection('contact')} className="text-left text-white hover:text-luxury-gold transition-colors">Contact</button>
            <Button 
              onClick={() => scrollToSection('booking')}
              className="bg-gradient-to-r from-luxury-gold to-soft-pink text-black hover:opacity-90 w-full"
            >
              Book Now
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
