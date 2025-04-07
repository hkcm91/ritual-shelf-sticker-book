
import React from 'react';
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useBookshelfStore } from "@/store/bookshelfStore";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ColorPicker from '../../ColorPicker';

interface ShelfAppearanceSectionProps {
  linkDividerStyling: boolean;
}

const ShelfAppearanceSection: React.FC<ShelfAppearanceSectionProps> = ({ 
  linkDividerStyling 
}) => {
  const { 
    shelfStyling, 
    updateShelfThickness,
    updateShelfColor,
    updateShelfOpacity,
    updateDividersSetting
  } = useBookshelfStore();
  
  // Handle wood texture selection
  const handleTextureSelection = (value: string) => {
    const textures = {
      'light-oak': '/lovable-uploads/76a4e934-9979-4f17-9a6a-bbe647ea3836.png',
      'dark-oak': '/lovable-uploads/bde4bb25-8c74-4447-82c9-08783b8d0056.png',
      'mahogany': '/lovable-uploads/1325adda-a404-4af6-9549-1925cd1394be.png',
      'dark-walnut': '/lovable-uploads/6583044d-0b9d-49ea-a8f6-a3ac405b78d5.png',
      'none': ''
    };
    
    const colors = {
      'light-oak': '#d2b48c',
      'dark-oak': '#5c4033', 
      'mahogany': '#7d4b32',
      'dark-walnut': '#3b2314',
      'none': '#8B5A2B'
    };
    
    const newColor = colors[value as keyof typeof colors] || '#8B5A2B';
    
    updateShelfColor(newColor);
    
    // If divider styling is linked, update divider color as well
    if (linkDividerStyling && shelfStyling?.dividers?.enabled) {
      updateDividersSetting('color', newColor);
    }
  };
  
  // Handle shelf color change with linked styling
  const handleShelfColorChange = (color: string) => {
    updateShelfColor(color);
    
    // If divider styling is linked, update divider color as well
    if (linkDividerStyling && shelfStyling?.dividers?.enabled) {
      updateDividersSetting('color', color);
    }
  };

  return (
    <div className="rounded-md border p-4 space-y-4">
      <h3 className="font-medium text-lg">Shelf Appearance</h3>
      
      <div className="space-y-2">
        <Label>Wood Style</Label>
        <Select onValueChange={handleTextureSelection} defaultValue="dark-walnut">
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select wood style" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light-oak">Light Oak</SelectItem>
            <SelectItem value="dark-oak">Dark Oak</SelectItem>
            <SelectItem value="mahogany">Mahogany</SelectItem>
            <SelectItem value="dark-walnut">Dark Walnut</SelectItem>
            <SelectItem value="none">Custom Color</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label>Shelf Color</Label>
        <div className="flex items-center gap-2">
          <ColorPicker 
            color={shelfStyling?.color || '#8B5A2B'} 
            onChange={handleShelfColorChange} 
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label>Shelf Thickness</Label>
          <span className="text-sm">{shelfStyling?.thickness || 20}px</span>
        </div>
        <Slider
          value={[shelfStyling?.thickness || 20]}
          min={10}
          max={40}
          step={2}
          onValueChange={(value) => updateShelfThickness(value[0])}
        />
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label>Opacity</Label>
          <span className="text-sm">{Math.round((shelfStyling?.opacity || 1) * 100)}%</span>
        </div>
        <Slider
          value={[(shelfStyling?.opacity || 1) * 100]}
          min={20}
          max={100}
          step={5}
          onValueChange={(value) => updateShelfOpacity(value[0] / 100)}
        />
      </div>
    </div>
  );
};

export default ShelfAppearanceSection;
