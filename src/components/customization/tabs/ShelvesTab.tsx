
import React from 'react';
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useBookshelfStore } from "@/store/bookshelfStore";
import ColorPicker from '../ColorPicker';

const ShelvesTab: React.FC = () => {
  const { 
    shelfStyling, 
    updateShelfThickness,
    updateShelfColor,
    updateShelfOpacity
  } = useBookshelfStore();

  return (
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
  );
};

export default ShelvesTab;
