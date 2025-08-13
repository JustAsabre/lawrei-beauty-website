import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X, Phone, Mail } from "lucide-react";

const navigationItems = [
  { name: "Home", href: "#home" },
  { name: "Services", href: "#services" },
  { name: "Portfolio", href: "#portfolio" },
  { name: "About", href: "#about" },
  { name: "Testimonials", href: "#testimonials" },
  { name: "Contact", href: "#contact" }
];

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  const handleNavClick = (href: string) => {
    const sectionId = href.replace('#', '');
    scrollToSection(sectionId);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-black/95 backdrop-blur-md border-b border-gray-800' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="font-display text-2xl lg:text-3xl font-bold gradient-text">
              Lawrei Beauty
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavClick(item.href)}
                className="text-gray-300 hover:text-luxury-gold transition-colors duration-200 font-medium relative group"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-luxury-gold to-soft-pink transition-all duration-300 group-hover:w-full"></span>
              </button>
            ))}
          </div>

          {/* Contact Info & CTA */}
          <div className="hidden lg:flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-gray-400 text-sm">
              <Phone className="w-4 h-4" />
              <span>(555) 123-4567</span>
            </div>
            <Button 
              onClick={() => scrollToSection('booking')}
              className="bg-gradient-to-r from-luxury-gold to-soft-pink text-black font-semibold hover:opacity-90 px-6 py-2"
            >
              Book Now
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 bg-black border-l border-gray-800">
                <div className="flex flex-col h-full">
                  {/* Mobile Menu Header */}
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="font-display text-xl font-bold gradient-text">
                      Menu
                    </h2>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-white"
                    >
                      <X className="w-6 h-6" />
                    </Button>
                  </div>

                  {/* Mobile Navigation */}
                  <nav className="flex-1 space-y-4">
                    {navigationItems.map((item) => (
                      <button
                        key={item.name}
                        onClick={() => handleNavClick(item.href)}
                        className="w-full text-left text-lg text-gray-300 hover:text-luxury-gold transition-colors duration-200 py-3 border-b border-gray-800"
                      >
                        {item.name}
                      </button>
                    ))}
                  </nav>

                  {/* Mobile Contact Info */}
                  <div className="space-y-4 pt-8 border-t border-gray-800">
                    <div className="flex items-center space-x-3 text-gray-400">
                      <Phone className="w-5 h-5" />
                      <span>(555) 123-4567</span>
                    </div>
                    <div className="flex items-center space-x-3 text-gray-400">
                      <Mail className="w-5 h-5" />
                      <span>hello@lawreismakeup.com</span>
                    </div>
                    <Button 
                      onClick={() => scrollToSection('booking')}
                      className="w-full bg-gradient-to-r from-luxury-gold to-soft-pink text-black font-semibold hover:opacity-90 py-3"
                    >
                      Book Your Session
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
