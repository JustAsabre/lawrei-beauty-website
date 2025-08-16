import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, 
  Edit, 
  Save, 
  Loader2, 
  Image as ImageIcon,
  Type,
  Globe,
  User,
  Phone,
  Mail,
  MapPin,
  Plus
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { refreshAllSiteContent } from "@/hooks/use-site-content";

interface SiteContent {
  id: string;
  section: string;
  title?: string;
  subtitle?: string;
  content?: string;
  imageUrl?: string;
  settings?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const CONTENT_SECTIONS = [
  { key: 'hero', name: 'Hero Section', icon: Globe },
  { key: 'about', name: 'About Section', icon: User },
  { key: 'contact_info', name: 'Contact Information', icon: Phone },
  { key: 'footer', name: 'Footer Content', icon: FileText },
];

export default function AdminContent() {
  const [activeSection, setActiveSection] = useState('hero');
  const [contentData, setContentData] = useState<Record<string, SiteContent>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("adminToken");
      if (!token) {
        toast({
          title: "Error",
          description: "Authentication required",
          variant: "destructive",
        });
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'https://lawrei-beauty-website.onrender.com'}/admin/site-content`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        const contentMap: Record<string, SiteContent> = {};
        data.forEach((item: SiteContent) => {
          contentMap[item.section] = item;
        });
        setContentData(contentMap);
      } else {
        throw new Error('Failed to fetch content');
      }
    } catch (error) {
      console.error('Error fetching content:', error);
      toast({
        title: "Error",
        description: "Failed to fetch site content from database",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveContent = async (section: string, data: Partial<SiteContent>) => {
    try {
      setIsSaving(true);
      const token = localStorage.getItem("adminToken");
      if (!token) {
        toast({
          title: "Error",
          description: "Authentication required",
          variant: "destructive",
        });
        return;
      }

      const existingContent = contentData[section];
      const method = existingContent ? 'PUT' : 'POST';
      const url = existingContent 
        ? `${import.meta.env.VITE_BACKEND_URL || 'https://lawrei-beauty-website.onrender.com'}/admin/site-content/${section}`
        : `${import.meta.env.VITE_BACKEND_URL || 'https://lawrei-beauty-website.onrender.com'}/admin/site-content`;

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          section,
          ...data,
          isActive: true
        })
      });

      if (response.ok) {
        const updatedContent = await response.json();
        setContentData(prev => ({
          ...prev,
          [section]: updatedContent
        }));
        
        // Force refresh the frontend by invalidating the query cache
        // This ensures the frontend immediately reflects the changes
        if (window.location.pathname.includes('/admin')) {
          // If we're in admin, refresh the content
          await fetchContent();
        }
        
        // Refresh all site content to ensure frontend is updated
        try {
          await refreshAllSiteContent();
        } catch (error) {
          console.warn('Failed to refresh site content:', error);
        }
        
        toast({
          title: "Success",
          description: "Content saved successfully and frontend updated",
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save content');
      }
    } catch (error) {
      console.error('Error saving content:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save content",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const updateContentField = (section: string, field: string, value: string) => {
    setContentData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      } as SiteContent
    }));
  };

  const renderHeroEditor = () => {
    const heroContent = contentData['hero'] || {};
    
    return (
      <div className="space-y-6">
        <Card className="glass-morphism border-gray-600">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Globe className="w-5 h-5 mr-2" />
              Hero Section Content
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Main Headline</label>
              <Input
                placeholder="Transform Your Beauty"
                className="bg-black/50 border-gray-600 text-white"
                value={heroContent.title || ''}
                onChange={(e) => updateContentField('hero', 'title', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Subtitle</label>
              <Input
                placeholder="Professional makeup artistry for your most special moments"
                className="bg-black/50 border-gray-600 text-white"
                value={heroContent.subtitle || ''}
                onChange={(e) => updateContentField('hero', 'subtitle', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
              <Textarea
                placeholder="From bridal glamour to everyday elegance, let's create your perfect look."
                className="bg-black/50 border-gray-600 text-white"
                rows={4}
                value={heroContent.content || ''}
                onChange={(e) => updateContentField('hero', 'content', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Background Image URL (optional)</label>
              <Input
                placeholder="https://your-image-url.com/hero-bg.jpg"
                className="bg-black/50 border-gray-600 text-white"
                value={heroContent.imageUrl || ''}
                onChange={(e) => updateContentField('hero', 'imageUrl', e.target.value)}
              />
            </div>
            <Button
              onClick={() => handleSaveContent('hero', heroContent)}
              disabled={isSaving}
              className="w-full bg-gradient-to-r from-luxury-gold to-soft-pink text-black hover:opacity-90"
            >
              {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              Save Hero Content
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderAboutEditor = () => {
    const aboutContent = contentData['about'] || {};
    
    return (
      <div className="space-y-6">
        <Card className="glass-morphism border-gray-600">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <User className="w-5 h-5 mr-2" />
              About Section Content
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Section Title</label>
              <Input
                placeholder="About Lawrei"
                className="bg-black/50 border-gray-600 text-white"
                value={aboutContent.title || ''}
                onChange={(e) => updateContentField('about', 'title', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Subtitle</label>
              <Input
                placeholder="Professional Makeup Artist & Beauty Expert"
                className="bg-black/50 border-gray-600 text-white"
                value={aboutContent.subtitle || ''}
                onChange={(e) => updateContentField('about', 'subtitle', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">About Text</label>
              <Textarea
                placeholder="Tell your story, experience, and what makes you unique..."
                className="bg-black/50 border-gray-600 text-white"
                rows={6}
                value={aboutContent.content || ''}
                onChange={(e) => updateContentField('about', 'content', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Profile Image URL</label>
              <Input
                placeholder="https://your-image-url.com/profile.jpg"
                className="bg-black/50 border-gray-600 text-white"
                value={aboutContent.imageUrl || ''}
                onChange={(e) => updateContentField('about', 'imageUrl', e.target.value)}
              />
            </div>
            <Button
              onClick={() => handleSaveContent('about', aboutContent)}
              disabled={isSaving}
              className="w-full bg-gradient-to-r from-luxury-gold to-soft-pink text-black hover:opacity-90"
            >
              {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              Save About Content
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderContactEditor = () => {
    const contactContent = contentData['contact_info'] || {};
    
    return (
      <div className="space-y-6">
        <Card className="glass-morphism border-gray-600">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Phone className="w-5 h-5 mr-2" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Business Name</label>
                <Input
                  placeholder="LawreiBeauty Studio"
                  className="bg-black/50 border-gray-600 text-white"
                  value={contactContent.title || ''}
                  onChange={(e) => updateContentField('contact_info', 'title', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
                <Input
                  placeholder="+1 (555) 123-4567"
                  className="bg-black/50 border-gray-600 text-white"
                  value={contactContent.subtitle || ''}
                  onChange={(e) => updateContentField('contact_info', 'subtitle', e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
              <Input
                placeholder="hello@lawreibeauty.com"
                className="bg-black/50 border-gray-600 text-white"
                value={contactContent.content || ''}
                onChange={(e) => updateContentField('contact_info', 'content', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Business Address</label>
              <Textarea
                placeholder="123 Beauty Street, Suite 100, City, State 12345"
                className="bg-black/50 border-gray-600 text-white"
                rows={3}
                value={contactContent.imageUrl || ''}
                onChange={(e) => updateContentField('contact_info', 'imageUrl', e.target.value)}
              />
            </div>
            <Button
              onClick={() => handleSaveContent('contact_info', contactContent)}
              disabled={isSaving}
              className="w-full bg-gradient-to-r from-luxury-gold to-soft-pink text-black hover:opacity-90"
            >
              {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              Save Contact Information
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderFooterEditor = () => {
    const footerContent = contentData['footer'] || {};
    
    return (
      <div className="space-y-6">
        <Card className="glass-morphism border-gray-600">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Footer Content
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Copyright Text</label>
              <Input
                placeholder="© 2024 LawreiBeauty. All rights reserved."
                className="bg-black/50 border-gray-600 text-white"
                value={footerContent.title || ''}
                onChange={(e) => updateContentField('footer', 'title', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Footer Description</label>
              <Input
                placeholder="Professional makeup artistry for every occasion"
                className="bg-black/50 border-gray-600 text-white"
                value={footerContent.subtitle || ''}
                onChange={(e) => updateContentField('footer', 'subtitle', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Additional Footer Text</label>
              <Textarea
                placeholder="Any additional footer information, policies, or links..."
                className="bg-black/50 border-gray-600 text-white"
                rows={4}
                value={footerContent.content || ''}
                onChange={(e) => updateContentField('footer', 'content', e.target.value)}
              />
            </div>
            <Button
              onClick={() => handleSaveContent('footer', footerContent)}
              disabled={isSaving}
              className="w-full bg-gradient-to-r from-luxury-gold to-soft-pink text-black hover:opacity-90"
            >
              {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              Save Footer Content
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-luxury-gold" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-display font-bold text-white">Site Content Management</h2>
        <div className="flex items-center space-x-2">
          <Badge className="bg-gradient-to-r from-luxury-gold to-soft-pink text-black">
            {Object.keys(contentData).length} Sections
          </Badge>
        </div>
      </div>

      <Tabs value={activeSection} onValueChange={setActiveSection} className="w-full">
        <TabsList className="grid w-full grid-cols-4 glass-morphism border-gray-600">
          {CONTENT_SECTIONS.map((section) => {
            const IconComponent = section.icon;
            return (
              <TabsTrigger
                key={section.key}
                value={section.key}
                className="data-[state=active]:bg-luxury-gold data-[state=active]:text-black"
              >
                <IconComponent className="w-4 h-4 mr-2" />
                {section.name}
              </TabsTrigger>
            );
          })}
        </TabsList>

        <TabsContent value="hero" className="mt-6">
          {renderHeroEditor()}
        </TabsContent>

        <TabsContent value="about" className="mt-6">
          {renderAboutEditor()}
        </TabsContent>

        <TabsContent value="contact_info" className="mt-6">
          {renderContactEditor()}
        </TabsContent>

        <TabsContent value="footer" className="mt-6">
          {renderFooterEditor()}
        </TabsContent>
      </Tabs>

      <Card className="glass-morphism border-gray-600">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Content Management Tips</h3>
              <p className="text-gray-400 text-sm">
                Changes made here will be reflected on your live website. Make sure to save your changes after editing each section.
              </p>
            </div>
            <Button
              onClick={refreshAllSiteContent}
              variant="outline"
              className="glass-morphism border-gray-600 hover:bg-luxury-gold hover:text-black"
            >
              Refresh Content
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}