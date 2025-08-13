import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Heart, Share2, Instagram } from "lucide-react";

const portfolioItems = [
  {
    id: 1,
    title: "Bridal Elegance",
    category: "bridal",
    description: "Classic bridal makeup with a modern twist",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80",
    likes: 128,
    views: 1200,
    featured: true
  },
  {
    id: 2,
    title: "Glamorous Evening",
    category: "evening",
    description: "Sophisticated evening makeup for special events",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80",
    likes: 95,
    views: 890,
    featured: false
  },
  {
    id: 3,
    title: "Natural Beauty",
    category: "natural",
    description: "Enhancing natural features with subtle makeup",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80",
    likes: 156,
    views: 1450,
    featured: true
  },
  {
    id: 4,
    title: "Photoshoot Ready",
    category: "photoshoot",
    description: "Professional makeup optimized for photography",
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80",
    likes: 203,
    views: 2100,
    featured: false
  },
  {
    id: 5,
    title: "Bold & Beautiful",
    category: "bold",
    description: "Dramatic makeup for those who love to stand out",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80",
    likes: 87,
    views: 750,
    featured: false
  },
  {
    id: 6,
    title: "Classic Red Lip",
    category: "classic",
    description: "Timeless red lip look with perfect complexion",
    image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80",
    likes: 134,
    views: 1100,
    featured: true
  }
];

const categories = [
  { id: "all", name: "All", count: portfolioItems.length },
  { id: "bridal", name: "Bridal", count: portfolioItems.filter(item => item.category === "bridal").length },
  { id: "evening", name: "Evening", count: portfolioItems.filter(item => item.category === "evening").length },
  { id: "natural", name: "Natural", count: portfolioItems.filter(item => item.category === "natural").length },
  { id: "photoshoot", name: "Photoshoot", count: portfolioItems.filter(item => item.category === "photoshoot").length },
  { id: "bold", name: "Bold", count: portfolioItems.filter(item => item.category === "bold").length },
  { id: "classic", name: "Classic", count: portfolioItems.filter(item => item.category === "classic").length }
];

export default function PortfolioShowcase() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedItem, setSelectedItem] = useState<typeof portfolioItems[0] | null>(null);

  const filteredItems = selectedCategory === "all" 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === selectedCategory);

  const handleItemClick = (item: typeof portfolioItems[0]) => {
    setSelectedItem(item);
  };

  const closeModal = () => {
    setSelectedItem(null);
  };

  return (
    <section id="portfolio" className="py-20 px-6 bg-black">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6 gradient-text">
            Portfolio Showcase
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Explore my latest work and discover the perfect makeup style for your next special occasion.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.id)}
              className={`${
                selectedCategory === category.id
                  ? "bg-gradient-to-r from-luxury-gold to-soft-pink text-black"
                  : "glass-morphism border-gray-600 hover:bg-luxury-gold hover:text-black"
              }`}
            >
              {category.name}
              <Badge variant="secondary" className="ml-2 bg-black/20 text-white">
                {category.count}
              </Badge>
            </Button>
          ))}
        </div>

        {/* Portfolio Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredItems.map((item) => (
            <Card 
              key={item.id} 
              className="group cursor-pointer overflow-hidden glass-morphism border-gray-600 hover:border-luxury-gold transition-all duration-300 hover:scale-105"
              onClick={() => handleItemClick(item)}
            >
              <div className="relative overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="text-center text-white">
                    <Eye className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-sm">Click to view</p>
                  </div>
                </div>

                {/* Featured Badge */}
                {item.featured && (
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-gradient-to-r from-luxury-gold to-soft-pink text-black">
                      Featured
                    </Badge>
                  </div>
                )}

                {/* Category Badge */}
                <div className="absolute top-3 right-3">
                  <Badge variant="outline" className="bg-black/50 text-white border-gray-400">
                    {item.category}
                  </Badge>
                </div>
              </div>

              <CardContent className="p-4">
                <h3 className="font-display text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm mb-3">{item.description}</p>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Heart className="w-4 h-4 text-red-400" />
                    <span>{item.likes}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Eye className="w-4 h-4 text-blue-400" />
                    <span>{item.views}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="glass-morphism rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="font-display text-2xl font-semibold mb-4">
              Love What You See?
            </h3>
            <p className="text-gray-300 mb-6">
              Follow me on Instagram for daily inspiration and behind-the-scenes content.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-luxury-gold to-soft-pink text-black font-semibold hover:opacity-90"
              >
                <Instagram className="w-5 h-5 mr-2" />
                Follow on Instagram
              </Button>
              <Button 
                variant="outline"
                size="lg"
                className="glass-morphism border-gray-600 hover:bg-luxury-gold hover:text-black"
              >
                <Share2 className="w-5 h-5 mr-2" />
                Share Portfolio
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={closeModal}>
          <div className="bg-black border border-gray-600 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="relative">
              <img 
                src={selectedItem.image} 
                alt={selectedItem.title}
                className="w-full h-96 object-cover rounded-t-2xl"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={closeModal}
                className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white"
              >
                ×
              </Button>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-2xl font-semibold">{selectedItem.title}</h3>
                <Badge className="bg-gradient-to-r from-luxury-gold to-soft-pink text-black">
                  {selectedItem.category}
                </Badge>
              </div>
              <p className="text-gray-300 mb-4">{selectedItem.description}</p>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Heart className="w-4 h-4 text-red-400" />
                    <span>{selectedItem.likes} likes</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Eye className="w-4 h-4 text-blue-400" />
                    <span>{selectedItem.views} views</span>
                  </div>
                </div>
                <Button className="bg-gradient-to-r from-luxury-gold to-soft-pink text-black">
                  Book This Look
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
