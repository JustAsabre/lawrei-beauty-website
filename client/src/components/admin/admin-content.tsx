import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, 
  Save, 
  Loader2, 
  Globe,
  User,
  Phone,
  History,
  Eye,
  RotateCcw,
  AlertCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSiteManagement, useSiteContent, useContentPreview } from "@/hooks/use-site-management";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { SEOEditor } from "@/components/ui/seo-editor";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";

const CONTENT_SECTIONS = [
  { key: 'hero', name: 'Hero Section', icon: Globe },
  { key: 'about', name: 'About Section', icon: User },
  { key: 'contact_info', name: 'Contact Information', icon: Phone },
  { key: 'footer', name: 'Footer Content', icon: FileText },
];

export default function AdminContent() {
  const [activeSection, setActiveSection] = useState('hero');
  const [showPreview, setShowPreview] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  
  const { toast } = useToast();
  const { isDirty, pendingChanges, updateContent, discardChanges } = useSiteManagement();
  const { content, isLoading, saveContent, contentVersions, rollbackVersion, uploadImage } = useSiteContent(activeSection);
  const { previewContent } = useContentPreview();

  const handleSave = async () => {
    try {
      const changes = pendingChanges[activeSection];
      if (!changes) return;

      await saveContent({
        section: activeSection,
        data: changes,
      });

      discardChanges();
      toast({
        title: "Success",
        description: "Content saved successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save content",
        variant: "destructive",
      });
    }
  };

  const handlePreview = async () => {
    try {
      const previewUrl = await previewContent(
        activeSection,
        pendingChanges[activeSection] || content || {}
      );
      setPreviewUrl(previewUrl);
      setShowPreview(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate preview",
        variant: "destructive",
      });
    }
  };

  const handleRollback = async (versionId: string) => {
    try {
      await rollbackVersion({
        section: activeSection,
        versionId,
      });

      setShowVersionHistory(false);
      toast({
        title: "Success",
        description: "Content rolled back successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to rollback content",
        variant: "destructive",
      });
    }
  };

  const handleImageUpload = async (file: File) => {
    try {
      const result = await uploadImage({
        section: activeSection,
        file,
      });
      return result.url;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
      throw error;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-luxury-gold" />
      </div>
    );
  }

  const currentContent = pendingChanges[activeSection] || content || {};

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-display font-bold text-white">Site Content Management</h2>
        <div className="flex items-center space-x-2">
          {isDirty && (
            <Alert variant="warning" className="py-2">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Unsaved Changes</AlertTitle>
            </Alert>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowVersionHistory(true)}
            className="glass-morphism border-gray-600"
          >
            <History className="w-4 h-4 mr-2" />
            History
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreview}
            className="glass-morphism border-gray-600"
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button
            onClick={handleSave}
            disabled={!isDirty}
            className="bg-gradient-to-r from-luxury-gold to-soft-pink text-black"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
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

        <TabsContent value={activeSection} className="mt-6">
          <Card className="glass-morphism border-gray-600">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                {CONTENT_SECTIONS.find(s => s.key === activeSection)?.icon({ className: "w-5 h-5 mr-2" })}
                {CONTENT_SECTIONS.find(s => s.key === activeSection)?.name} Content
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <RichTextEditor
                value={currentContent.content || ""}
                onChange={(value) => updateContent(activeSection, { content: value })}
                onImageUpload={handleImageUpload}
                className="min-h-[300px]"
              />

              <SEOEditor
                value={{
                  title: currentContent.seoMetadata?.title || "",
                  description: currentContent.seoMetadata?.description || "",
                  keywords: currentContent.seoMetadata?.keywords || [],
                  ogImage: currentContent.seoMetadata?.ogImage,
                }}
                onChange={(metadata) => updateContent(activeSection, { seoMetadata: metadata })}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Version History Dialog */}
      <Dialog open={showVersionHistory} onOpenChange={setShowVersionHistory}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Version History</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {contentVersions?.map((version: any) => (
                <Card key={version.id} className="glass-morphism border-gray-600">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-sm text-gray-400">
                          Version {version.version}
                        </p>
                        <p className="text-xs text-gray-500">
                          {format(new Date(version.createdAt), "PPpp")}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRollback(version.id)}
                        className="glass-morphism border-gray-600"
                      >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Rollback
                      </Button>
                    </div>
                    <div className="prose prose-sm prose-invert max-w-none">
                      <div dangerouslySetInnerHTML={{ __html: version.data.content || "" }} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="sm:max-w-[90vw] h-[90vh]">
          <DialogHeader>
            <DialogTitle>Content Preview</DialogTitle>
          </DialogHeader>
          <div className="flex-1 h-full">
            <iframe
              src={previewUrl}
              className="w-full h-full border-0"
              title="Content Preview"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}