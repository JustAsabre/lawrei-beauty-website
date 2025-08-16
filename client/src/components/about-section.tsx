import { Button } from "@/components/ui/button";
import { Award, Star, Users, Calendar } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export default function AboutSection() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Fetch about content from site content API
  const { data: aboutContent } = useQuery({
    queryKey: ["/api/site-content/about"],
    queryFn: async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'https://lawrei-beauty-website.onrender.com'}/admin/site-content/about`);
        if (response.ok) {
          return response.json();
        }
        return null;
      } catch (error) {
        console.error('Error fetching about content:', error);
        return null;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Use fetched content or fallback to defaults
  const title = aboutContent?.title || "About Lawrei";
  const subtitle = aboutContent?.subtitle || "Passionate makeup artist dedicated to helping you discover and enhance your natural beauty.";
  const content = aboutContent?.content || "My journey in makeup artistry began with a simple passion for helping people feel confident and beautiful. What started as a hobby quickly evolved into a professional career that has brought me immense joy and fulfillment. Over the past 5+ years, I've had the privilege of working with hundreds of clients, each with their own unique vision and style. I believe that makeup is more than just cosmetics—it's a form of self-expression and confidence.";
  const profileImage = aboutContent?.imageUrl || "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1000&q=80";

  return (
    <section id="about" className="py-16 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6 gradient-text">
            {title}
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Left Column - Story */}
          <div className="space-y-8">
            <div className="glass-morphism rounded-2xl p-8">
              <h3 className="font-display text-2xl font-semibold mb-4 text-white">
                My Story
              </h3>
              <p className="text-gray-300 leading-relaxed">
                {content}
              </p>
            </div>

            {/* Skills */}
            <div className="glass-morphism rounded-2xl p-8">
              <h3 className="font-display text-2xl font-semibold mb-6 text-white">
                Specializations
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-luxury-gold to-soft-pink rounded-full flex items-center justify-center">
                    <Award className="w-5 h-5 text-black" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">Bridal Makeup</div>
                    <div className="text-sm text-luxury-gold">Expert</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-luxury-gold to-soft-pink rounded-full flex items-center justify-center">
                    <Star className="w-5 h-5 text-black" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">Special Events</div>
                    <div className="text-sm text-luxury-gold">Advanced</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Image & Stats */}
          <div className="space-y-8">
            {/* Profile Image */}
            <div className="relative">
              <img 
                src={profileImage}
                alt="Lawrei - Professional Makeup Artist"
                className="w-full h-96 object-cover rounded-2xl"
              />
              <div className="absolute -bottom-4 -right-4 bg-gradient-to-r from-luxury-gold to-soft-pink text-black px-4 py-2 rounded-full font-semibold">
                <Award className="inline w-5 h-5 mr-2" />
                Professional Artist
              </div>
            </div>

            {/* Achievements */}
            <div className="grid grid-cols-2 gap-4">
              <div className="glass-morphism border-gray-600 text-center p-4 rounded-xl">
                <Users className="w-8 h-8 mx-auto mb-2 text-luxury-gold" />
                <div className="text-2xl font-bold text-white">500+</div>
                <div className="text-sm text-gray-400">Happy Clients</div>
              </div>
              <div className="glass-morphism border-gray-600 text-center p-4 rounded-xl">
                <Calendar className="w-8 h-8 mx-auto mb-2 text-luxury-gold" />
                <div className="text-2xl font-bold text-white">5+</div>
                <div className="text-sm text-gray-400">Years Experience</div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="glass-morphism rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="font-display text-2xl font-semibold mb-4">
              Ready to Experience the Difference?
            </h3>
            <p className="text-gray-300 mb-6">
              Let's work together to create the perfect look for your special occasion. 
              I can't wait to help you feel beautiful and confident!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                onClick={() => scrollToSection('booking')}
                className="px-8 py-3 bg-gradient-to-r from-luxury-gold to-soft-pink text-black font-semibold hover:opacity-90"
              >
                Book Your Session
              </Button>
              <Button 
                variant="outline"
                size="lg"
                onClick={() => scrollToSection('contact')}
                className="px-8 py-3 glass-morphism border-gray-600 hover:bg-luxury-gold hover:text-black"
              >
                Get in Touch
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
