import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin, Heart, ArrowUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

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

  // Fetch footer content from site content API
  const { data: footerContent } = useQuery({
    queryKey: ["/api/site-content/footer"],
    queryFn: async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'https://lawrei-beauty-website.onrender.com'}/admin/site-content/footer`);
        if (response.ok) {
          return response.json();
        }
        return null;
      } catch (error) {
        console.error('Error fetching footer content:', error);
        return null;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch contact info from site content API
  const { data: contactContent } = useQuery({
    queryKey: ["/api/site-content/contact_info"],
    queryFn: async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'https://lawrei-beauty-website.onrender.com'}/admin/site-content/contact_info`);
        if (response.ok) {
          return response.json();
        }
        return null;
      } catch (error) {
        console.error('Error fetching contact content:', error);
        return null;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Use fetched content or fallback to defaults
  const copyrightText = footerContent?.title || "© 2024 LawreiBeauty. All rights reserved.";
  const footerDescription = footerContent?.subtitle || "Professional makeup artistry for every occasion";
  const additionalFooterText = footerContent?.content || "";
  
  const businessName = contactContent?.title || "LawreiBeauty Studio";
  const businessPhone = contactContent?.subtitle || "(555) 123-4567";
  const businessEmail = contactContent?.content || "hello@lawreismakeup.com";
  const businessAddress = contactContent?.imageUrl || "Los Angeles, CA";

  const contactInfo = [
    { icon: Phone, text: businessPhone, href: `tel:${businessPhone.replace(/\D/g, '')}` },
    { icon: Mail, text: businessEmail, href: `mailto:${businessEmail}` },
    { icon: MapPin, text: businessAddress, href: "#" }
  ];

  return (
    <footer className="bg-black border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <h3 className="font-display text-2xl font-bold gradient-text mb-4">
              {businessName}
            </h3>
            <p className="text-gray-400 mb-6 max-w-md">
              {footerDescription}
            </p>
            {additionalFooterText && (
              <p className="text-gray-500 text-sm mb-6">
                {additionalFooterText}
              </p>
            )}
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
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2 text-gray-400">
              <Heart className="w-4 h-4 text-red-500 fill-current" />
              <span className="text-sm">{copyrightText}</span>
            </div>
            
            <Button
              onClick={scrollToTop}
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-luxury-gold"
            >
              <ArrowUp className="w-4 h-4 mr-2" />
              Back to Top
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}
