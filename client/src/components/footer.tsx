import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin, Heart, ArrowUp } from "lucide-react";

const socialLinks = [
  { name: "Instagram", icon: Instagram, href: "#", color: "hover:text-pink-400" },
  { name: "Facebook", icon: Facebook, href: "#", color: "hover:text-blue-400" },
  { name: "Twitter", icon: Twitter, href: "#", color: "hover:text-blue-300" },
  { name: "YouTube", icon: Youtube, href: "#", color: "hover:text-red-400" }
];

const quickLinks = [
  { name: "Services", href: "#services" },
  { name: "Portfolio", href: "#portfolio" },
  { name: "About", href: "#about" },
  { name: "Testimonials", href: "#testimonials" },
  { name: "Contact", href: "#contact" },
  { name: "Book Now", href: "#booking" }
];

const contactInfo = [
  { icon: Phone, text: "(555) 123-4567", href: "tel:+15551234567" },
  { icon: Mail, text: "hello@lawreismakeup.com", href: "mailto:hello@lawreismakeup.com" },
  { icon: MapPin, text: "Los Angeles, CA", href: "#" }
];

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-black border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <h3 className="font-display text-2xl font-bold gradient-text mb-4">
              Lawrei Beauty
            </h3>
            <p className="text-gray-400 mb-6 max-w-md">
              Professional makeup artistry for your most special moments. 
              From bridal glamour to everyday elegance, let's create your perfect look.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    className={`w-10 h-10 glass-morphism rounded-full flex items-center justify-center text-gray-400 transition-colors duration-200 ${social.color}`}
                    aria-label={social.name}
                  >
                    <IconComponent className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <button
                    onClick={() => scrollToSection(link.href.replace('#', ''))}
                    className="text-gray-400 hover:text-luxury-gold transition-colors duration-200"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact Info</h4>
            <ul className="space-y-3">
              {contactInfo.map((contact) => {
                const IconComponent = contact.icon;
                return (
                  <li key={contact.text}>
                    <a
                      href={contact.href}
                      className="flex items-center space-x-3 text-gray-400 hover:text-luxury-gold transition-colors duration-200"
                    >
                      <IconComponent className="w-4 h-4 flex-shrink-0" />
                      <span className="text-sm">{contact.text}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="border-t border-gray-800 pt-8 mb-8">
          <div className="max-w-md mx-auto text-center">
            <h4 className="text-white font-semibold mb-2">Stay Updated</h4>
            <p className="text-gray-400 text-sm mb-4">
              Get beauty tips, special offers, and portfolio updates delivered to your inbox.
            </p>
            <div className="flex space-x-2">
              <Input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-gray-900 border-gray-700 text-white placeholder-gray-400 focus:border-luxury-gold"
              />
              <Button className="bg-gradient-to-r from-luxury-gold to-soft-pink text-black hover:opacity-90">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between">
          <div className="text-gray-400 text-sm mb-4 md:mb-0">
            © 2024 Lawrei Beauty. All rights reserved. Made with{" "}
            <Heart className="inline w-4 h-4 text-red-400" /> in Los Angeles.
          </div>
          
          <div className="flex items-center space-x-6 text-sm text-gray-400">
            <button className="hover:text-luxury-gold transition-colors">Privacy Policy</button>
            <button className="hover:text-luxury-gold transition-colors">Terms of Service</button>
            <button 
              onClick={scrollToTop}
              className="w-10 h-10 glass-morphism rounded-full flex items-center justify-center hover:bg-luxury-gold hover:text-black transition-all duration-200"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
