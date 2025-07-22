import { Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Sarah M.",
    service: "Bridal Client",
    rating: 5,
    text: "Lawrei made me feel absolutely stunning on my wedding day. Her attention to detail and gentle approach made the entire experience so relaxing and enjoyable.",
    initial: "S"
  },
  {
    id: 2,
    name: "Amanda R.",
    service: "Editorial Client",
    rating: 5,
    text: "Professional, talented, and so sweet! Lawrei created the perfect look for my photoshoot. The makeup looked flawless both in person and on camera.",
    initial: "A"
  },
  {
    id: 3,
    name: "Maria L.",
    service: "Regular Client",
    rating: 5,
    text: "I've never felt more confident! Lawrei has an incredible eye for what works with my features. She's now my go-to for all special occasions.",
    initial: "M"
  }
];

export default function TestimonialsSection() {
  return (
    <section className="py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-display text-3xl font-bold text-center mb-12 gradient-text">Client Love</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="glass-morphism p-6 rounded-2xl animate-slide-up">
              <div className="flex items-center mb-4">
                <div className="flex text-luxury-gold">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-gray-300 mb-4 italic">"{testimonial.text}"</p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-luxury-gold to-soft-pink rounded-full flex items-center justify-center text-black font-semibold text-sm">
                  {testimonial.initial}
                </div>
                <div className="ml-3">
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-gray-400">{testimonial.service}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
