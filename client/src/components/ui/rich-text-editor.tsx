import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link as LinkIcon,
  Image as ImageIcon,
  List,
  ListOrdered,
  Type,
  Heading1,
  Heading2,
  Heading3,
  X,
} from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  onImageUpload?: (file: File) => Promise<string>;
  className?: string;
  placeholder?: string;
}

export function RichTextEditor({
  value,
  onChange,
  onImageUpload,
  className = "",
  placeholder = "Start typing...",
}: RichTextEditorProps) {
  const [editor, setEditor] = useState<HTMLDivElement | null>(null);
  const [linkUrl, setLinkUrl] = useState("");
  const [showLinkInput, setShowLinkInput] = useState(false);

  useEffect(() => {
    if (editor) {
      editor.innerHTML = value;
    }
  }, [editor, value]);

  const handleEditorChange = useCallback(() => {
    if (editor) {
      onChange(editor.innerHTML);
    }
  }, [editor, onChange]);

  const execCommand = useCallback(
    (command: string, value: string | null = null) => {
      document.execCommand(command, false, value);
      handleEditorChange();
    },
    [handleEditorChange]
  );

  const handleFormat = (format: string) => {
    execCommand(format);
  };

  const handleLink = () => {
    if (!showLinkInput) {
      setShowLinkInput(true);
      return;
    }

    if (linkUrl) {
      execCommand("createLink", linkUrl);
      setLinkUrl("");
      setShowLinkInput(false);
    }
  };

  const handleImage = async (file: File) => {
    if (onImageUpload) {
      try {
        const imageUrl = await onImageUpload(file);
        execCommand("insertImage", imageUrl);
      } catch (error) {
        console.error("Failed to upload image:", error);
      }
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleImage(file);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex flex-wrap items-center gap-1 p-2 bg-black/30 rounded-t-lg border-b border-gray-600">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleFormat("bold")}
          className="w-8 h-8"
        >
          <Bold className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleFormat("italic")}
          className="w-8 h-8"
        >
          <Italic className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleFormat("underline")}
          className="w-8 h-8"
        >
          <Underline className="w-4 h-4" />
        </Button>

        <div className="w-px h-6 bg-gray-600 mx-1" />

        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleFormat("justifyLeft")}
          className="w-8 h-8"
        >
          <AlignLeft className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleFormat("justifyCenter")}
          className="w-8 h-8"
        >
          <AlignCenter className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleFormat("justifyRight")}
          className="w-8 h-8"
        >
          <AlignRight className="w-4 h-4" />
        </Button>

        <div className="w-px h-6 bg-gray-600 mx-1" />

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="w-8 h-8">
              <Type className="w-4 h-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-40 p-1">
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => execCommand("formatBlock", "h1")}
            >
              <Heading1 className="w-4 h-4 mr-2" />
              Heading 1
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => execCommand("formatBlock", "h2")}
            >
              <Heading2 className="w-4 h-4 mr-2" />
              Heading 2
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => execCommand("formatBlock", "h3")}
            >
              <Heading3 className="w-4 h-4 mr-2" />
              Heading 3
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => execCommand("formatBlock", "p")}
            >
              <Type className="w-4 h-4 mr-2" />
              Paragraph
            </Button>
          </PopoverContent>
        </Popover>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleFormat("insertUnorderedList")}
          className="w-8 h-8"
        >
          <List className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleFormat("insertOrderedList")}
          className="w-8 h-8"
        >
          <ListOrdered className="w-4 h-4" />
        </Button>

        <div className="w-px h-6 bg-gray-600 mx-1" />

        <Popover open={showLinkInput} onOpenChange={setShowLinkInput}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="w-8 h-8">
              <LinkIcon className="w-4 h-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-3">
            <div className="flex space-x-2">
              <Input
                type="url"
                placeholder="Enter URL"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleLink}>Add Link</Button>
            </div>
          </PopoverContent>
        </Popover>

        {onImageUpload && (
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8"
            onClick={() => document.getElementById("image-upload")?.click()}
          >
            <ImageIcon className="w-4 h-4" />
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </Button>
        )}
      </div>

      <div
        ref={setEditor}
        contentEditable
        className="min-h-[200px] p-4 bg-black/20 rounded-b-lg focus:outline-none prose prose-invert max-w-none"
        onInput={handleEditorChange}
        placeholder={placeholder}
        dangerouslySetInnerHTML={{ __html: value }}
      />
    </div>
  );
}
