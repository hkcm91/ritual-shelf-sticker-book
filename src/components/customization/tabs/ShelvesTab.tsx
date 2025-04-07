
import React from 'react';
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { useBookshelfStore } from "@/store/bookshelfStore";
import ColorPicker from '../ColorPicker';
import FileInputField from '../FileInputField';

const ShelvesTab: React.FC = () => {
  const { 
    shelfStyling, 
    updateShelfThickness,
    updateShelfColor,
    updateShelfBackgroundImage,
    updateShelfOpacity,
    toggleDividers,
    updateDividersSetting
  } = useBookshelfStore();

  return (
    <>
      <div className="rounded-md border p-4 space-y-4">
        <h3 className="font-medium text-lg">Shelf Appearance</h3>
        
        <div className="space-y-2">
          <Label>Shelf Color</Label>
          <ColorPicker 
            color={shelfStyling.color} 
            onChange={updateShelfColor} 
          />
        </div>
        
        <div className="space-y-2">
          <Label>Shelf Texture</Label>
          <FileInputField
            value={shelfStyling.backgroundImage}
            onChange={updateShelfBackgroundImage}
            placeholder="Enter texture URL"
            uploadLabel="Upload Texture"
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label>Shelf Thickness</Label>
            <span className="text-sm">{shelfStyling.thickness}px</span>
          </div>
          <Slider
            value={[shelfStyling.thickness]}
            min={4}
            max={40}
            step={2}
            onValueChange={(value) => updateShelfThickness(value[0])}
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label>Opacity</Label>
            <span className="text-sm">{Math.round(shelfStyling.opacity * 100)}%</span>
          </div>
          <Slider
            value={[shelfStyling.opacity * 100]}
            min={20}
            max={100}
            step={5}
            onValueChange={(value) => updateShelfOpacity(value[0] / 100)}
          />
        </div>
      </div>
      
      <div className="rounded-md border p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-lg">Shelf Dividers</h3>
          <div className="flex items-center space-x-2">
            <Switch
              id="dividers-enabled"
              checked={shelfStyling.dividers.enabled}
              onCheckedChange={toggleDividers}
            />
            <Label htmlFor="dividers-enabled" className="cursor-pointer">
              {shelfStyling.dividers.enabled ? 'Enabled' : 'Disabled'}
            </Label>
          </div>
        </div>
        
        <div className={shelfStyling.dividers.enabled ? "" : "opacity-50 pointer-events-none"}>
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Books Per Section</Label>
              <span className="text-sm">{shelfStyling.dividers.booksPerSection}</span>
            </div>
            <Slider
              value={[shelfStyling.dividers.booksPerSection]}
              min={2}
              max={8}
              step={1}
              onValueChange={(value) => updateDividersSetting('booksPerSection', value[0])}
              disabled={!shelfStyling.dividers.enabled}
            />
          </div>
          
          <div className="space-y-2 mt-4">
            <div className="flex justify-between">
              <Label>Divider Thickness</Label>
              <span className="text-sm">{shelfStyling.dividers.thickness}px</span>
            </div>
            <Slider
              value={[shelfStyling.dividers.thickness]}
              min={1}
              max={10}
              step={1}
              onValueChange={(value) => updateDividersSetting('thickness', value[0])}
              disabled={!shelfStyling.dividers.enabled}
            />
          </div>
          
          <div className="space-y-2 mt-4">
            <Label>Divider Color</Label>
            <ColorPicker 
              color={shelfStyling.dividers.color} 
              onChange={(color) => updateDividersSetting('color', color)} 
              disabled={!shelfStyling.dividers.enabled}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ShelvesTab;
