import { useState } from "react";
import { Button } from "@/components/ui/button";

const portfolioItems = [
  {
    id: 1,
    category: "bridal",
    title: "Bridal Elegance",
    description: "Soft glam for outdoor wedding",
    image: "https://images.unsplash.com/photo-1487412912498-0447578fcca8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=800"
  },
  {
    id: 2,
    category: "editorial",
    title: "Editorial Beauty",
    description: "Bold editorial shoot",
    image: "https://pixabay.com/get/gec9d4de755da302bb914a81a520d9dbf8bb6145de8daba4e38a9c54141098f264a5030db0949635406421912bf92d2becc1c00acc2bbf227d2c7d52804cd0a08_1280.jpg"
  },
  {
    id: 3,
    category: "special",
    title: "Evening Glam",
    description: "Red carpet ready",
    image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=800"
  },
  {
    id: 4,
    category: "editorial",
    title: "Natural Glow",
    description: "Fresh beauty look",
    image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=800"
  },
  {
    id: 5,
    category: "editorial",
    title: "Artistic Vision",
    description: "Creative editorial piece",
    image: "https://images.unsplash.com/photo-1583001931096-959e9a1a6223?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=800"
  },
  {
    id: 6,
    category: "bridal",
    title: "Classic Bride",
    description: "Timeless elegance",
    image: "https://pixabay.com/get/g3b5e4e7c0c756c94bf898990bc2a5abbee1179f6db8ca6241a1d888b04bad1c68582cdf43b693aff3500e86cbdc8f2ac489aa47d799a7d2ed3d05380f4158910_1280.jpg"
  }
];

const filterOptions = [
  { value: "all", label: "All Work" },
  { value: "bridal", label: "Bridal" },
  { value: "editorial", label: "Editorial" },
  { value: "special", label: "Special Events" }
];

export default function PortfolioShowcase() {
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredItems = activeFilter === "all" 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === activeFilter);

  return (
    <section id="portfolio" className="py-16 px-6 bg-gradient-to-b from-black to-rich-black">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-display text-3xl font-bold text-center mb-12 gradient-text">Portfolio Highlights</h2>
        
        {/* Filter buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {filterOptions.map((option) => (
            <Button
              key={option.value}
              onClick={() => setActiveFilter(option.value)}
              className={`px-6 py-2 rounded-full font-semibold ${
                activeFilter === option.value
                  ? "bg-luxury-gold text-black"
                  : "glass-morphism text-white hover:bg-luxury-gold hover:text-black"
              }`}
            >
              {option.label}
            </Button>
          ))}
        </div>

        {/* Portfolio grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div key={item.id} className="portfolio-item rounded-2xl overflow-hidden glass-morphism">
              <div className="relative group">
                <img 
                  src={item.image}
                  alt={item.title}
                  className="w-full h-64 object-cover" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <div className="p-4 text-white">
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-sm text-gray-300">{item.description}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button 
            variant="outline"
            className="px-8 py-3 border-2 border-luxury-gold text-luxury-gold hover:bg-luxury-gold hover:text-black"
          >
            View Full Portfolio
          </Button>
        </div>
      </div>
    </section>
  );
}
