
import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useBookshelfStore } from "@/store/bookshelfStore";
import ColorPicker from '../ColorPicker';
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { HelpCircle, Link, Link2Off } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const ShelvesTab: React.FC = () => {
  const { 
    shelfStyling, 
    updateShelfThickness,
    updateShelfColor,
    updateShelfOpacity,
    toggleDividers,
    updateDividersSetting,
    updateAllDividerSettings
  } = useBookshelfStore();

  // Add state to track if divider styling is linked
  const [linkDividerStyling, setLinkDividerStyling] = useState(true);

  // Handle orientation change with the correct type
  const handleOrientationChange = (value: string) => {
    updateDividersSetting('orientation', value as 'vertical' | 'horizontal' | 'both');
  };

  // Handle books per row change with the correct type
  const handleBooksPerRowChange = (value: number) => {
    updateDividersSetting('booksPerRow', value);
  };

  // Handle background texture selection
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
  
  // Handle divider color change with linked styling
  const handleDividerColorChange = (color: string) => {
    updateDividersSetting('color', color);
    
    // If divider styling is linked, update shelf color as well
    if (linkDividerStyling) {
      updateShelfColor(color);
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
    <div className="space-y-6">
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

      <div className="rounded-md border p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-lg">Dividers</h3>
          <Switch 
            id="enable-dividers" 
            checked={shelfStyling?.dividers?.enabled || false}
            onCheckedChange={(checked) => toggleDividers(checked)}
          />
        </div>
        
        {shelfStyling?.dividers?.enabled && (
          <>
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Label>Link Divider Styling</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="w-60 text-sm">When enabled, dividers will use the same color as shelves and update together</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="flex items-center gap-2">
                {linkDividerStyling ? (
                  <Link className="h-4 w-4 text-primary" />
                ) : (
                  <Link2Off className="h-4 w-4 text-muted-foreground" />
                )}
                <Switch 
                  checked={linkDividerStyling}
                  onCheckedChange={setLinkDividerStyling}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Divider Orientation</Label>
              <RadioGroup 
                value={shelfStyling?.dividers?.orientation || 'vertical'} 
                onValueChange={handleOrientationChange}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="vertical" id="vertical" />
                  <Label htmlFor="vertical">Vertical</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="horizontal" id="horizontal" />
                  <Label htmlFor="horizontal">Horizontal</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="both" id="both" />
                  <Label htmlFor="both">Both</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Books Per Section</Label>
                <Input
                  type="number"
                  min={2}
                  max={10}
                  value={shelfStyling?.dividers?.booksPerSection || 6}
                  onChange={(e) => updateDividersSetting('booksPerSection', parseInt(e.target.value))}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">Between vertical dividers</p>
              </div>
              
              <div className="space-y-2">
                <Label>Books Per Row</Label>
                <Input
                  type="number"
                  min={1}
                  max={10}
                  value={shelfStyling?.dividers?.booksPerRow || 2}
                  onChange={(e) => handleBooksPerRowChange(parseInt(e.target.value))}
                  className="w-full"
                  disabled={!['horizontal', 'both'].includes(shelfStyling?.dividers?.orientation || 'vertical')}
                />
                <p className="text-xs text-muted-foreground">Between horizontal dividers</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Divider Thickness</Label>
                <span className="text-sm">{shelfStyling?.dividers?.thickness || 2}px</span>
              </div>
              <Slider
                value={[shelfStyling?.dividers?.thickness || 2]}
                min={1}
                max={12}
                step={1}
                onValueChange={(value) => updateDividersSetting('thickness', value[0])}
              />
            </div>
            
            {!linkDividerStyling && (
              <div className="space-y-2">
                <Label>Divider Color</Label>
                <div className="flex items-center gap-2">
                  <ColorPicker 
                    color={shelfStyling?.dividers?.color || '#714621'} 
                    onChange={handleDividerColorChange} 
                  />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ShelvesTab;
