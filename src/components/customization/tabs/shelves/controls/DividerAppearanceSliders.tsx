
import React from 'react';
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useBookshelfStore } from "@/store/bookshelfStore";

const DividerAppearanceSliders: React.FC = () => {
  const { 
    shelfStyling, 
    updateDividersSetting
  } = useBookshelfStore();

  return (
    <>
      <div className="space-y-2 mt-4">
        <div className="flex justify-between items-center">
          <Label>Divider Thickness</Label>
          <span className="text-sm font-medium">{shelfStyling?.dividers?.thickness || 2}px</span>
        </div>
        <Slider
          value={[shelfStyling?.dividers?.thickness || 2]}
          min={1}
          max={16}
          step={1}
          onValueChange={(value) => updateDividersSetting('thickness', value[0])}
        />
        <p className="text-xs text-muted-foreground">
          Adjust the width of divider lines between book sections
        </p>
      </div>
      
      <div className="space-y-2 mt-4">
        <div className="flex justify-between items-center">
          <Label>Divider Height</Label>
          <span className="text-sm font-medium">{shelfStyling?.dividers?.height || 200}px</span>
        </div>
        <Slider
          value={[shelfStyling?.dividers?.height || 200]}
          min={100}
          max={300}
          step={10}
          onValueChange={(value) => updateDividersSetting('height', value[0])}
        />
        <p className="text-xs text-muted-foreground">
          Control how tall the vertical dividers appear on the shelf
        </p>
      </div>
      
      <div className="space-y-2 mt-4">
        <div className="flex justify-between items-center">
          <Label>Divider Opacity</Label>
          <span className="text-sm font-medium">{Math.round((shelfStyling?.dividers?.opacity || 1) * 100)}%</span>
        </div>
        <Slider
          value={[(shelfStyling?.dividers?.opacity || 1) * 100]}
          min={20}
          max={100}
          step={5}
          onValueChange={(value) => updateDividersSetting('opacity', value[0] / 100)}
        />
        <p className="text-xs text-muted-foreground">
          Adjust the transparency of dividers on your bookshelf
        </p>
      </div>
    </>
  );
};

export default DividerAppearanceSliders;
