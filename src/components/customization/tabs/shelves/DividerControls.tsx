
import React from 'react';
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { useBookshelfStore } from "@/store/bookshelfStore";
import { ShelfDividers } from '@/store/slices/customization/types/shelfStyling';

interface DividerControlsProps {
  linkDividerStyling: boolean;
}

const DividerControls: React.FC<DividerControlsProps> = ({ 
  linkDividerStyling 
}) => {
  const { 
    shelfStyling, 
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
  
  // Handle divider color change
  const handleDividerColorChange = (color: string) => {
    updateDividersSetting('color', color);
  };

  return (
    <>
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
    </>
  );
};

export default DividerControls;
