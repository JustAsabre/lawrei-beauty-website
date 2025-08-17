import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Globe, Search, Share2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SEOMetadata {
  title: string;
  description: string;
  keywords: string[];
  ogImage?: string;
}

interface SEOEditorProps {
  value: SEOMetadata;
  onChange: (metadata: SEOMetadata) => void;
  className?: string;
}

export function SEOEditor({
  value,
  onChange,
  className = "",
}: SEOEditorProps) {
  const [keywords, setKeywords] = useState<string>("");
  const [previewType, setPreviewType] = useState<"google" | "facebook" | "twitter">("google");

  useEffect(() => {
    setKeywords(value.keywords.join(", "));
  }, [value.keywords]);

  const handleKeywordsChange = (newKeywords: string) => {
    setKeywords(newKeywords);
    onChange({
      ...value,
      keywords: newKeywords.split(",").map((k) => k.trim()).filter(Boolean),
    });
  };

  const getScore = (): { score: number; issues: string[] } => {
    const issues: string[] = [];
    let score = 100;

    if (!value.title) {
      issues.push("Missing meta title");
      score -= 20;
    } else if (value.title.length < 30 || value.title.length > 60) {
      issues.push("Meta title should be between 30-60 characters");
      score -= 10;
    }

    if (!value.description) {
      issues.push("Missing meta description");
      score -= 20;
    } else if (value.description.length < 120 || value.description.length > 160) {
      issues.push("Meta description should be between 120-160 characters");
      score -= 10;
    }

    if (!value.keywords.length) {
      issues.push("Missing keywords");
      score -= 10;
    }

    if (!value.ogImage) {
      issues.push("Missing social share image");
      score -= 10;
    }

    return { score: Math.max(0, score), issues };
  };

  const { score, issues } = getScore();

  return (
    <div className={`space-y-6 ${className}`}>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-semibold">SEO Settings</CardTitle>
          <Badge
            variant={score >= 80 ? "default" : score >= 60 ? "secondary" : "destructive"}
            className="ml-2"
          >
            Score: {score}%
          </Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Meta Title</label>
            <Input
              value={value.title}
              onChange={(e) => onChange({ ...value, title: e.target.value })}
              placeholder="Enter page title (30-60 characters)"
              className="bg-black/20"
            />
            <p className="text-xs text-gray-400">
              Characters: {value.title.length}/60
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Meta Description</label>
            <Textarea
              value={value.description}
              onChange={(e) => onChange({ ...value, description: e.target.value })}
              placeholder="Enter page description (120-160 characters)"
              className="bg-black/20"
            />
            <p className="text-xs text-gray-400">
              Characters: {value.description.length}/160
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Keywords</label>
            <Input
              value={keywords}
              onChange={(e) => handleKeywordsChange(e.target.value)}
              placeholder="Enter keywords, separated by commas"
              className="bg-black/20"
            />
            <p className="text-xs text-gray-400">
              Keywords: {value.keywords.length}
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Social Share Image</label>
            <Input
              value={value.ogImage}
              onChange={(e) => onChange({ ...value, ogImage: e.target.value })}
              placeholder="Enter image URL for social sharing"
              className="bg-black/20"
            />
          </div>

          {issues.length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <ul className="list-disc list-inside">
                  {issues.map((issue, index) => (
                    <li key={index}>{issue}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={previewType} onValueChange={(v) => setPreviewType(v as any)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="google">
                <Search className="w-4 h-4 mr-2" />
                Google
              </TabsTrigger>
              <TabsTrigger value="facebook">
                <Share2 className="w-4 h-4 mr-2" />
                Facebook
              </TabsTrigger>
              <TabsTrigger value="twitter">
                <Globe className="w-4 h-4 mr-2" />
                Twitter
              </TabsTrigger>
            </TabsList>

            <TabsContent value="google" className="mt-4">
              <div className="space-y-1">
                <h3 className="text-blue-400 text-xl hover:underline cursor-pointer">
                  {value.title || "Page Title"}
                </h3>
                <p className="text-green-600 text-sm">
                  {window.location.origin}
                </p>
                <p className="text-gray-300 text-sm">
                  {value.description || "Page description will appear here..."}
                </p>
              </div>
            </TabsContent>

            <TabsContent value="facebook" className="mt-4">
              <div className="border border-gray-700 rounded-lg overflow-hidden">
                {value.ogImage ? (
                  <img
                    src={value.ogImage}
                    alt="Social preview"
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-800 flex items-center justify-center">
                    <p className="text-gray-400">No preview image</p>
                  </div>
                )}
                <div className="p-4 space-y-2">
                  <p className="text-sm text-gray-400">
                    {window.location.origin}
                  </p>
                  <h3 className="font-bold">
                    {value.title || "Page Title"}
                  </h3>
                  <p className="text-sm text-gray-300">
                    {value.description || "Page description will appear here..."}
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="twitter" className="mt-4">
              <div className="border border-gray-700 rounded-lg overflow-hidden">
                {value.ogImage ? (
                  <img
                    src={value.ogImage}
                    alt="Social preview"
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-800 flex items-center justify-center">
                    <p className="text-gray-400">No preview image</p>
                  </div>
                )}
                <div className="p-4 space-y-2">
                  <h3 className="font-bold">
                    {value.title || "Page Title"}
                  </h3>
                  <p className="text-sm text-gray-300">
                    {value.description || "Page description will appear here..."}
                  </p>
                  <p className="text-sm text-gray-400">
                    {window.location.origin}
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
