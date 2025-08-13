import { Button } from "@/components/ui/button";
import { Calendar, ArrowRight, Star } from "lucide-react";

export default function HeroSection() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-rich-black via-black to-rich-black" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(212,175,55,0.1),transparent_50%)]" />
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-luxury-gold/20 to-soft-pink/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-r from-soft-pink/20 to-luxury-gold/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
      
      <div className="relative z-10 text-center px-6 max-w-6xl mx-auto">
        {/* Main Headline */}
        <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
          <span className="gradient-text">Transform</span>
          <br />
          <span className="text-white">Your Beauty</span>
        </h1>
        
        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
          Professional makeup artistry for your most special moments. 
          From bridal glamour to everyday elegance, let's create your perfect look.
        </p>
        
        {/* Trust Indicators */}
        <div className="flex items-center justify-center space-x-6 mb-8 text-gray-400">
          <div className="flex items-center space-x-2">
            <Star className="w-5 h-5 text-luxury-gold fill-current" />
            <span>5.0 Rating</span>
          </div>
          <div className="flex items-center space-x-2">
            <Star className="w-5 h-5 text-luxury-gold fill-current" />
            <span>500+ Happy Clients</span>
          </div>
          <div className="flex items-center space-x-2">
            <Star className="w-5 h-5 text-luxury-gold fill-current" />
            <span>5 Years Experience</span>
          </div>
        </div>
        
        {/* Call to Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            size="lg"
            onClick={() => scrollToSection('booking')}
            className="px-8 py-4 text-lg bg-gradient-to-r from-luxury-gold to-soft-pink text-black font-semibold hover:opacity-90 transform hover:scale-105 transition-all duration-200"
          >
            <Calendar className="w-5 h-5 mr-2" />
            Book Your Session
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          
          <Button 
            variant="outline"
            size="lg"
            onClick={() => scrollToSection('portfolio')}
            className="px-8 py-4 text-lg glass-morphism border-gray-600 text-white hover:bg-luxury-gold hover:text-black hover:border-luxury-gold transform hover:scale-105 transition-all duration-200"
          >
            View Portfolio
          </Button>
        </div>
        
        {/* Scroll Indicator */}
        <button 
          onClick={() => scrollToSection('services')}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce cursor-pointer group"
          aria-label="Scroll to services"
        >
          <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center group-hover:border-luxury-gold transition-colors">
            <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-pulse group-hover:bg-luxury-gold transition-colors" />
          </div>
        </button>
      </div>
    </section>
  );
}
