
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Image, Link } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface BackgroundTabContentProps {
  backgroundFileRef: React.RefObject<HTMLInputElement>;
  tempBackgroundColor: string;
  tempBackgroundOpacity: number;
  setTempBackgroundColor: (color: string) => void;
  setTempBackgroundOpacity: (opacity: number) => void;
  handleBackgroundFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  backgroundImageUrl?: string;
  setBackgroundImageUrl?: (url: string) => void;
}

const BackgroundTabContent: React.FC<BackgroundTabContentProps> = ({
  backgroundFileRef,
  tempBackgroundColor,
  tempBackgroundOpacity,
  setTempBackgroundColor,
  setTempBackgroundOpacity,
  handleBackgroundFileChange,
  backgroundImageUrl = '',
  setBackgroundImageUrl = () => {},
}) => {
  const [urlInput, setUrlInput] = React.useState(backgroundImageUrl);

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      setBackgroundImageUrl(urlInput);
    }
  };

  return (
    <div className="space-y-4 pt-4">
      <div className="grid grid-cols-3 items-center gap-4">
        <Label htmlFor="bgColor">Color</Label>
        <Input
          id="bgColor"
          type="color"
          value={tempBackgroundColor}
          onChange={(e) => setTempBackgroundColor(e.target.value)}
          className="col-span-2 h-10"
        />
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label htmlFor="bgOpacity">Opacity</Label>
          <span className="text-sm text-muted-foreground">{Math.round(tempBackgroundOpacity * 100)}%</span>
        </div>
        <Slider
          id="bgOpacity"
          min={0}
          max={1}
          step={0.01}
          value={[tempBackgroundOpacity]}
          onValueChange={(values) => setTempBackgroundOpacity(values[0])}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="bgImage">Background Image</Label>
        <div className="flex gap-2">
          <Input
            ref={backgroundFileRef}
            id="bgImage"
            type="file"
            accept="image/*"
            onChange={handleBackgroundFileChange}
            className="flex-1"
          />
          <Button 
            type="button" 
            variant="outline"
            size="icon"
            onClick={() => backgroundFileRef.current?.click()}
          >
            <Image className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Image URL Input */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label htmlFor="bgImageUrl">Image URL</Label>
          <span className="text-xs text-muted-foreground">(Alternative to file upload)</span>
        </div>
        <div className="flex gap-2">
          <Input
            id="bgImageUrl"
            type="url"
            placeholder="https://example.com/image.jpg"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            className="flex-1"
          />
          <Button 
            type="button"
            variant="outline"
            size="icon"
            onClick={handleUrlSubmit}
          >
            <Link className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Preview */}
      {(backgroundImageUrl || tempBackgroundColor) && (
        <div className="mt-4 border rounded p-2">
          <p className="text-sm mb-2 font-medium">Preview:</p>
          <div 
            className="h-24 w-full rounded"
            style={{
              backgroundColor: tempBackgroundColor,
              backgroundImage: backgroundImageUrl ? `url(${backgroundImageUrl})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: tempBackgroundOpacity
            }}
          />
        </div>
      )}
    </div>
  );
};

export default BackgroundTabContent;
