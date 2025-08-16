import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Eye, Heart } from "lucide-react";

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  isActive: boolean;
  createdAt: string;
}

export default function PortfolioShowcase() {
  // Fetch real portfolio items from backend
  const { data: portfolioItems = [], isLoading } = useQuery({
    queryKey: ["/api/portfolio"],
    queryFn: async () => {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'https://lawrei-beauty-website.onrender.com'}/api/portfolio`);
      if (!response.ok) throw new Error('Failed to fetch portfolio');
      return response.json();
    }
  });

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      facial: "bg-blue-500",
      massage: "bg-green-500",
      manicure: "bg-pink-500",
      pedicure: "bg-purple-500",
      hair: "bg-orange-500",
      makeup: "bg-red-500",
      waxing: "bg-yellow-500",
      other: "bg-gray-500"
    };
    return colors[category] || "bg-gray-500";
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      facial: "✨",
      massage: "💆‍♀️",
      manicure: "💅",
      pedicure: "🦶",
      hair: "💇‍♀️",
      makeup: "💄",
      waxing: "🪒",
      other: "🌟"
    };
    return icons[category] || "🌟";
  };

  if (isLoading) {
    return (
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold mb-4 gradient-text">Portfolio Showcase</h2>
            <p className="text-gray-400">Loading our beautiful transformations...</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="glass-morphism border-gray-600 animate-pulse">
                <CardContent className="p-6">
                  <div className="h-48 bg-gray-600 rounded mb-4"></div>
                  <div className="h-4 bg-gray-600 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-600 rounded w-full mb-2"></div>
                  <div className="h-3 bg-gray-600 rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="portfolio" className="py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl font-bold mb-4 gradient-text">Portfolio Showcase</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Discover the artistry and expertise behind every transformation. Our portfolio showcases real results 
            from our premium beauty services, demonstrating the quality and attention to detail you can expect.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolioItems.map((item: PortfolioItem) => (
            <Card key={item.id} className="glass-morphism border-gray-600 hover:border-luxury-gold transition-all duration-300 hover:scale-105 group">
              <CardContent className="p-0 overflow-hidden">
                {/* Image Container */}
                <div className="relative overflow-hidden">
                  <img 
                    src={item.imageUrl} 
                    alt={item.title}
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                    onError={(e) => {
                      // Fallback image if the main image fails to load
                      (e.target as HTMLImageElement).src = '/images/portfolio/fallback.jpg';
                    }}
                  />
                  <div className="absolute top-2 left-2">
                    <Badge className={`${getCategoryColor(item.category)} text-white`}>
                      {getCategoryIcon(item.category)} {item.category}
                    </Badge>
                  </div>
                  <div className="absolute top-2 right-2 flex space-x-1">
                    <div className="w-8 h-8 glass-morphism rounded-full flex items-center justify-center hover:bg-luxury-gold hover:text-black transition-colors cursor-pointer">
                      <Heart className="w-4 h-4" />
                    </div>
                    <div className="w-8 h-8 glass-morphism rounded-full flex items-center justify-center hover:bg-luxury-gold hover:text-black transition-colors cursor-pointer">
                      <Eye className="w-4 h-4" />
                    </div>
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-3 text-white">{item.title}</h3>
                  <p className="text-gray-400 mb-4 line-clamp-3">{item.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-luxury-gold fill-current" />
                      <Star className="w-4 h-4 text-luxury-gold fill-current" />
                      <Star className="w-4 h-4 text-luxury-gold fill-current" />
                      <Star className="w-4 h-4 text-luxury-gold fill-current" />
                      <Star className="w-4 h-4 text-luxury-gold fill-current" />
                    </div>
                    <span className="text-sm text-gray-400">Premium Quality</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {portfolioItems.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-600 rounded-full flex items-center justify-center">
              <Eye className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Portfolio Coming Soon</h3>
            <p className="text-gray-400">We're currently preparing our portfolio showcase. Check back soon to see our amazing transformations!</p>
          </div>
        )}
        
        <div className="text-center mt-12">
          <p className="text-gray-400 mb-4">
            Every transformation tells a story of beauty, confidence, and expertise
          </p>
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-400">
            <div className="flex items-center space-x-2">
              <Star className="w-4 h-4 text-luxury-gold" />
              <span>Before & After</span>
            </div>
            <div className="flex items-center space-x-2">
              <Eye className="w-4 h-4 text-luxury-gold" />
              <span>Real Results</span>
            </div>
            <div className="flex items-center space-x-2">
              <Heart className="w-4 h-4 text-luxury-gold" />
              <span>Client Satisfaction</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
