
import React from 'react';
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { useBookshelfStore } from "@/store/bookshelfStore";
import ColorPicker from '../ColorPicker';
import FileInputField from '../FileInputField';
import BorderStyleSelector from '../BorderStyleSelector';

const ContainerTab: React.FC = () => {
  const { 
    container, 
    updateContainerBackground, 
    updateContainerOpacity,
    updateContainerBackgroundImage,
    updateContainerBorder,
    updateContainerPadding
  } = useBookshelfStore();

  return (
    <div className="space-y-8">
      <div className="rounded-md border p-4 space-y-4">
        <h3 className="font-medium text-lg">Background</h3>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Background Color</Label>
            <ColorPicker 
              color={container?.background || '#a47148'} 
              onChange={updateContainerBackground} 
            />
          </div>
          
          <div className="space-y-2">
            <Label>Background Image</Label>
            <FileInputField
              value={container?.backgroundImage || ''} 
              onChange={(url) => updateContainerBackgroundImage(url)}
              placeholder="Enter image URL"
              uploadLabel="Upload Image"
            />
            <p className="text-xs text-muted-foreground">
              Image will be stretched to fill the container
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Opacity</Label>
              <span className="text-sm">{Math.round((container?.opacity || 1) * 100)}%</span>
            </div>
            <Slider
              value={[(container?.opacity || 1) * 100]}
              min={20}
              max={100}
              step={5}
              onValueChange={(value) => updateContainerOpacity(value[0] / 100)}
            />
          </div>
        </div>
      </div>
      
      <div className="rounded-md border p-4 space-y-4">
        <h3 className="font-medium text-lg">Border</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Customize the border appearance of your bookshelf container
        </p>
        
        <div className="bg-muted/40 rounded-md p-3 space-y-4">
          <h4 className="font-medium text-base mb-2">Border Appearance</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Width</Label>
                <span className="text-sm">{container?.borderWidth || 0}px</span>
              </div>
              <Slider
                value={[container?.borderWidth || 0]}
                min={0}
                max={10}
                step={1}
                onValueChange={(value) => updateContainerBorder('borderWidth', value[0])}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Style</Label>
              <BorderStyleSelector
                value={container?.borderStyle || 'solid'}
                onChange={(value) => updateContainerBorder('borderStyle', value)}
                disabled={!container?.borderWidth}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Color</Label>
              <ColorPicker 
                color={container?.borderColor || '#e0e0e0'} 
                onChange={(color) => updateContainerBorder('borderColor', color)}
                disabled={!container?.borderWidth}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Radius</Label>
                <span className="text-sm">{container?.borderRadius || 8}px</span>
              </div>
              <Slider
                value={[container?.borderRadius || 8]}
                min={0}
                max={40}
                step={2}
                onValueChange={(value) => updateContainerBorder('borderRadius', value[0])}
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="rounded-md border p-4 space-y-4">
        <h3 className="font-medium text-lg">Spacing</h3>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label>Padding</Label>
            <span className="text-sm">{container?.padding || 16}px</span>
          </div>
          <Slider
            value={[container?.padding || 16]}
            min={0}
            max={40}
            step={4}
            onValueChange={(value) => updateContainerPadding(value[0])}
          />
          <p className="text-xs text-muted-foreground">
            Adjusts the internal spacing between the container edge and the shelves
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContainerTab;
