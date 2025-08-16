import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Quote, ChevronLeft, ChevronRight, Heart } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Bride",
    rating: 5,
    text: "Lawrei made me feel absolutely stunning on my wedding day! Her attention to detail and ability to create the perfect bridal look exceeded all my expectations. The makeup lasted all day and looked incredible in photos.",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80",
    service: "Bridal Makeup",
    date: "March 2024",
    verified: true
  },
  {
    id: 2,
    name: "Emily Rodriguez",
    role: "Photoshoot Client",
    rating: 5,
    text: "I was nervous about my first professional photoshoot, but Lawrei made me feel so confident and beautiful. Her makeup skills are incredible and she really knows how to make features pop for the camera.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80",
    service: "Photoshoot Makeup",
    date: "February 2024",
    verified: true
  },
  {
    id: 3,
    name: "Jessica Chen",
    role: "Special Event Client",
    rating: 5,
    text: "Lawrei transformed my look for my company's gala event. I received so many compliments and felt like a million dollars. Her professionalism and talent are unmatched!",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80",
    service: "Special Event",
    date: "January 2024",
    verified: true
  },
  {
    id: 4,
    name: "Amanda Thompson",
    role: "Returning Client",
    rating: 5,
    text: "I've been coming to Lawrei for over 2 years now and she never disappoints. Whether it's a natural look for work or glam for a night out, she always knows exactly what I need.",
    image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80",
    service: "Multiple Services",
    date: "December 2023",
    verified: true
  },
  {
    id: 5,
    name: "Maria Garcia",
    role: "Bridal Party Client",
    rating: 5,
    text: "Lawrei did makeup for my entire bridal party and we all looked absolutely stunning! She managed to give each of us our own unique look while maintaining a cohesive bridal aesthetic.",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80",
    service: "Bridal Party",
    date: "November 2023",
    verified: true
  }
];

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedTestimonials, setLikedTestimonials] = useState<Set<number>>(new Set());

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const toggleLike = (testimonialId: number) => {
    setLikedTestimonials(prev => {
      const newSet = new Set(prev);
      if (newSet.has(testimonialId)) {
        newSet.delete(testimonialId);
      } else {
        newSet.add(testimonialId);
      }
      return newSet;
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`w-5 h-5 ${
          i < rating ? 'text-luxury-gold fill-current' : 'text-gray-400'
        }`} 
      />
    ));
  };

  return (
    <section id="testimonials" className="py-16 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6 gradient-text">
            What My Clients Say
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Don't just take my word for it. Here's what my amazing clients have to say about their experience.
          </p>
        </div>

        {/* Featured Testimonial */}
        <div className="mb-16">
          <Card className="glass-morphism border-luxury-gold/30 max-w-4xl mx-auto">
            <CardContent className="p-8">
              <div className="flex items-start space-x-6">
                <div className="flex-shrink-0">
                  <img 
                    src={testimonials[currentIndex].image} 
                    alt={testimonials[currentIndex].name}
                    className="w-20 h-20 rounded-full object-cover border-2 border-luxury-gold"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="flex items-center space-x-1">
                      {renderStars(testimonials[currentIndex].rating)}
                    </div>
                    {testimonials[currentIndex].verified && (
                      <Badge className="bg-green-600 text-white text-xs">
                        Verified Client
                      </Badge>
                    )}
                  </div>
                  
                  <blockquote className="text-lg text-gray-200 mb-4 leading-relaxed">
                    <Quote className="inline w-6 h-6 text-luxury-gold mr-2" />
                    {testimonials[currentIndex].text}
                  </blockquote>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-display text-lg font-semibold text-white">
                        {testimonials[currentIndex].name}
                      </h4>
                      <p className="text-gray-400 text-sm">
                        {testimonials[currentIndex].role} • {testimonials[currentIndex].service}
                      </p>
                      <p className="text-gray-500 text-xs">{testimonials[currentIndex].date}</p>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleLike(testimonials[currentIndex].id)}
                        className={`${
                          likedTestimonials.has(testimonials[currentIndex].id)
                            ? 'text-red-500'
                            : 'text-gray-400 hover:text-red-500'
                        }`}
                      >
                        <Heart className={`w-5 h-5 ${
                          likedTestimonials.has(testimonials[currentIndex].id) ? 'fill-current' : ''
                        }`} />
                      </Button>
                      
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={prevTestimonial}
                          className="w-10 h-10 glass-morphism border-gray-600 hover:bg-luxury-gold hover:text-black"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={nextTestimonial}
                          className="w-10 h-10 glass-morphism border-gray-600 hover:bg-luxury-gold hover:text-black"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Testimonial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {testimonials.slice(0, 3).map((testimonial) => (
            <Card key={testimonial.id} className="glass-morphism border-gray-600 hover:border-luxury-gold transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-white">{testimonial.name}</h4>
                    <p className="text-sm text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-1 mb-3">
                  {renderStars(testimonial.rating)}
                </div>
                
                <blockquote className="text-gray-300 text-sm leading-relaxed mb-4">
                  "{testimonial.text.length > 120 ? testimonial.text.substring(0, 120) + '...' : testimonial.text}"
                </blockquote>
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{testimonial.service}</span>
                  <span>{testimonial.date}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="glass-morphism rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="font-display text-2xl font-semibold mb-4">
              Ready to Join These Happy Clients?
            </h3>
            <p className="text-gray-300 mb-6">
              Book your session today and experience the Lawrei Beauty difference for yourself.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="px-8 py-3 bg-gradient-to-r from-luxury-gold to-soft-pink text-black font-semibold hover:opacity-90">
                Book Your Session
              </Button>
              <Button variant="outline" className="px-8 py-3 glass-morphism border-gray-600 hover:bg-luxury-gold hover:text-black">
                Read More Reviews
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
