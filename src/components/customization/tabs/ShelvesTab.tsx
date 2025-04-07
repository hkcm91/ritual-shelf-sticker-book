
import React from 'react';
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

const ShelvesTab: React.FC = () => {
  const { 
    shelfStyling, 
    updateShelfThickness,
    updateShelfColor,
    updateShelfOpacity,
    toggleDividers,
    updateDividersSetting
  } = useBookshelfStore();

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
      'light-oak': '/lovable-uploads/df4e485f-c6a6-48d8-990d-9ee89fcc76d0.png',
      'dark-oak': '/lovable-uploads/bde4bb25-8c74-4447-82c9-08783b8d0056.png',
      'mahogany': '/lovable-uploads/1325adda-a404-4af6-9549-1925cd1394be.png',
      'none': ''
    };
    
    updateShelfColor(value === 'mahogany' ? '#7d4b32' : 
                    value === 'dark-oak' ? '#5c4033' : 
                    value === 'light-oak' ? '#d2b48c' : '#8B5A2B');
  };

  return (
    <div className="space-y-6">
      <div className="rounded-md border p-4 space-y-4">
        <h3 className="font-medium text-lg">Shelf Appearance</h3>
        
        <div className="space-y-2">
          <Label>Wood Style</Label>
          <Select onValueChange={handleTextureSelection} defaultValue="light-oak">
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select wood style" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light-oak">Light Oak</SelectItem>
              <SelectItem value="dark-oak">Dark Oak</SelectItem>
              <SelectItem value="mahogany">Mahogany</SelectItem>
              <SelectItem value="none">Custom Color</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label>Shelf Color</Label>
          <div className="flex items-center gap-2">
            <ColorPicker 
              color={shelfStyling?.color || '#8B5A2B'} 
              onChange={updateShelfColor} 
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
        <h3 className="font-medium text-lg">Dividers</h3>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="enable-dividers">Enable Dividers</Label>
          <Switch 
            id="enable-dividers" 
            checked={shelfStyling?.dividers?.enabled || false}
            onCheckedChange={(checked) => toggleDividers(checked)}
          />
        </div>
        
        {shelfStyling?.dividers?.enabled && (
          <>
            <Separator />
            
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
              <p className="text-xs text-muted-foreground">Number of books between vertical dividers</p>
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
              <p className="text-xs text-muted-foreground">Number of rows between horizontal dividers</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Divider Thickness</Label>
                <span className="text-sm">{shelfStyling?.dividers?.thickness || 2}px</span>
              </div>
              <Slider
                value={[shelfStyling?.dividers?.thickness || 2]}
                min={1}
                max={8}
                step={1}
                onValueChange={(value) => updateDividersSetting('thickness', value[0])}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Divider Color</Label>
              <div className="flex items-center gap-2">
                <ColorPicker 
                  color={shelfStyling?.dividers?.color || '#714621'} 
                  onChange={(color) => updateDividersSetting('color', color)} 
                />
              </div>
            </div>
            
            <div className="mt-4">
              <Card className="bg-muted/40">
                <CardContent className="p-4">
                  <div className="text-sm text-muted-foreground">
                    <p className="mb-2 font-medium">Tips:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Vertical dividers appear between sections of books</li>
                      <li>Horizontal dividers appear between rows of books</li>
                      <li>Choose "Both" for a grid-like appearance</li>
                      <li>For a realistic bookcase look, use darker wood colors for dividers</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ShelvesTab;
