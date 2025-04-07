
import React, { useState } from 'react';
import { useBookshelfStore } from "@/store/bookshelfStore";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import ColorPicker from '../../ColorPicker';
import FileInputField from '../../FileInputField';

interface ShelfAppearanceSectionProps {
  linkDividerStyling: boolean;
}

const ShelfAppearanceSection: React.FC<ShelfAppearanceSectionProps> = ({ linkDividerStyling }) => {
  const { 
    shelfStyling, 
    updateShelfThickness, 
    updateShelfColor, 
    updateShelfOpacity,
    updateShelfBackgroundImage,
    updateDividersSetting
  } = useBookshelfStore();
  
  const [isImageLoading, setIsImageLoading] = useState(false);
  
  // Handle shelf color change with linked styling
  const handleShelfColorChange = (color: string) => {
    updateShelfColor(color);
    
    // If divider styling is linked, update divider color as well
    if (linkDividerStyling) {
      updateDividersSetting('color', color);
    }
  };
  
  // Handle texture image upload - convert File to string URL
  const handleTextureChange = (file: File) => {
    setIsImageLoading(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        updateShelfBackgroundImage(e.target.result as string);
      }
      setIsImageLoading(false);
    };
    reader.readAsDataURL(file);
  };
  
  // This is the adapter function that converts string URL to the expected format
  const handleTextureUrl = (url: string) => {
    updateShelfBackgroundImage(url);
  };

  return (
    <div className="rounded-md border p-4 space-y-4">
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-lg">Shelf Appearance</h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent side="right" className="max-w-[300px]">
                  <p>Customize the appearance of your bookshelf shelves</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        
        <Separator className="my-2" />
        
        <div className="space-y-5 pl-0.5">
          <div className="space-y-2">
            <h4 className="font-medium text-sm text-muted-foreground">Dimensions</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="shelf-thickness">Thickness</Label>
                <span className="text-sm text-muted-foreground">{shelfStyling?.thickness || 20}px</span>
              </div>
              <Slider
                id="shelf-thickness"
                value={[shelfStyling?.thickness || 20]}
                min={10}
                max={40}
                step={1}
                onValueChange={(values) => updateShelfThickness(values[0])}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium text-sm text-muted-foreground">Colors & Textures</h4>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Shelf Color</Label>
                <div className="flex items-center gap-2">
                  <ColorPicker 
                    color={shelfStyling?.color || '#8B5A2B'} 
                    onChange={handleShelfColorChange}
                  />
                  <span className="text-sm text-muted-foreground">{shelfStyling?.color}</span>
                </div>
                {linkDividerStyling && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Divider color will match shelf color
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="shelf-opacity">Opacity</Label>
                  <span className="text-sm text-muted-foreground">{Math.round((shelfStyling?.opacity || 1) * 100)}%</span>
                </div>
                <Slider
                  id="shelf-opacity"
                  value={[(shelfStyling?.opacity || 1) * 100]}
                  min={50}
                  max={100}
                  step={5}
                  onValueChange={(values) => updateShelfOpacity(values[0] / 100)}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Shelf Texture</Label>
                <FileInputField
                  value={shelfStyling?.backgroundImage || ""}
                  onChange={handleTextureUrl}
                  accept="image/*"
                  isLoading={isImageLoading}
                  setIsLoading={setIsImageLoading}
                  placeholder="Enter texture URL or upload image"
                  helpText="Upload a texture for your shelves"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShelfAppearanceSection;
