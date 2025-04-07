
import React from 'react';
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useBookshelfStore } from "@/store/bookshelfStore";
import ColorPicker from '../ColorPicker';

const ContainerTab: React.FC = () => {
  const { 
    container, 
    updateContainerBackground, 
    updateContainerOpacity
  } = useBookshelfStore();

  return (
    <div className="rounded-md border p-4 space-y-4">
      <h3 className="font-medium text-lg">Bookshelf Container</h3>
      
      <div className="space-y-2">
        <Label>Background Color</Label>
        <div className="flex items-center gap-2">
          <ColorPicker 
            color={container?.background || '#a47148'} 
            onChange={updateContainerBackground} 
          />
        </div>
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
  );
};

export default ContainerTab;
