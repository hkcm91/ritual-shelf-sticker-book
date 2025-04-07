
import React from 'react';
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useBookshelfStore } from "@/store/bookshelfStore";
import ColorPicker from '../ColorPicker';
import BorderStyleSelector from '../BorderStyleSelector';
import FileInputField from '../FileInputField';

const ContainerTab: React.FC = () => {
  const { 
    container, 
    updateContainerBackground, 
    updateContainerBackgroundImage,
    updateContainerOpacity,
    updateContainerBorder,
    updateContainerPadding
  } = useBookshelfStore();

  return (
    <div className="rounded-md border p-4 space-y-4">
      <h3 className="font-medium text-lg">Bookshelf Container</h3>
      
      <div className="space-y-2">
        <Label>Background Color</Label>
        <div className="flex items-center gap-2">
          <ColorPicker 
            color={container.background} 
            onChange={updateContainerBackground} 
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label>Background Image</Label>
        <FileInputField
          value={container.backgroundImage}
          onChange={updateContainerBackgroundImage}
          placeholder="Enter image URL"
          uploadLabel="Upload Image"
        />
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label>Opacity</Label>
          <span className="text-sm">{Math.round(container.opacity * 100)}%</span>
        </div>
        <Slider
          value={[container.opacity * 100]}
          min={20}
          max={100}
          step={5}
          onValueChange={(value) => updateContainerOpacity(value[0] / 100)}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Border Color</Label>
          <ColorPicker 
            color={container.borderColor} 
            onChange={(color) => updateContainerBorder('borderColor', color)} 
          />
        </div>
        
        <div className="space-y-2">
          <Label>Border Style</Label>
          <BorderStyleSelector 
            value={container.borderStyle}
            onChange={(style) => updateContainerBorder('borderStyle', style)}
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label>Border Width</Label>
            <span className="text-sm">{container.borderWidth}px</span>
          </div>
          <Slider
            value={[container.borderWidth]}
            min={0}
            max={10}
            step={1}
            onValueChange={(value) => updateContainerBorder('borderWidth', value[0])}
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label>Border Radius</Label>
            <span className="text-sm">{container.borderRadius}px</span>
          </div>
          <Slider
            value={[container.borderRadius]}
            min={0}
            max={24}
            step={1}
            onValueChange={(value) => updateContainerBorder('borderRadius', value[0])}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label>Padding</Label>
          <span className="text-sm">{container.padding}px</span>
        </div>
        <Slider
          value={[container.padding]}
          min={0}
          max={48}
          step={4}
          onValueChange={(value) => updateContainerPadding(value[0])}
        />
      </div>
    </div>
  );
};

export default ContainerTab;
