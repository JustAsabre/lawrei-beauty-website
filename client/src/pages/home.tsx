import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import ServicesOverview from "@/components/services-overview";
import PortfolioShowcase from "@/components/portfolio-showcase";
import BookingSection from "@/components/booking-section";
import AboutSection from "@/components/about-section";
import TestimonialsSection from "@/components/testimonials-section";
import ContactSection from "@/components/contact-section";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Calendar, MessageCircle } from "lucide-react";

export default function Home() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-black text-white">
      <Navigation />
      <HeroSection />
      <ServicesOverview />
      <PortfolioShowcase />
      <BookingSection />
      <AboutSection />
      <TestimonialsSection />
      <ContactSection />
      <Footer />
      
      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col space-y-3 z-50">
        <Button
          size="icon"
          className="w-14 h-14 bg-gradient-to-r from-luxury-gold to-soft-pink text-black shadow-lg animate-float hover:bg-luxury-gold rounded-full"
          onClick={() => scrollToSection('booking')}
        >
          <Calendar className="h-6 w-6" />
        </Button>
        <Button
          size="icon"
          className="w-14 h-14 glass-morphism text-luxury-gold shadow-lg hover:bg-luxury-gold hover:text-black rounded-full"
          onClick={() => scrollToSection('contact')}
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}
