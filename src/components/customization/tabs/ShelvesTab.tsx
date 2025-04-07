
import React from 'react';
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useBookshelfStore } from "@/store/bookshelfStore";
import ColorPicker from '../ColorPicker';
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const ShelvesTab: React.FC = () => {
  const { 
    shelfStyling, 
    updateShelfThickness,
    updateShelfColor,
    updateShelfOpacity,
    toggleDividers,
    updateDividersSetting
  } = useBookshelfStore();

  return (
    <div className="space-y-6">
      <div className="rounded-md border p-4 space-y-4">
        <h3 className="font-medium text-lg">Shelf Appearance</h3>
        
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
                onValueChange={(value) => updateDividersSetting('orientation', value)}
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
            </div>
            
            <div className="space-y-2">
              <Label>Books Per Row</Label>
              <Input
                type="number"
                min={2}
                max={10}
                value={shelfStyling?.dividers?.booksPerRow || 2}
                onChange={(e) => updateDividersSetting('booksPerRow', parseInt(e.target.value))}
                className="w-full"
                disabled={!['horizontal', 'both'].includes(shelfStyling?.dividers?.orientation || 'vertical')}
              />
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
          </>
        )}
      </div>
    </div>
  );
};

export default ShelvesTab;
