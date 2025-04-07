
import React from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { RowsIcon, Columns, Grid2X2 } from "lucide-react";

interface SimpleOrientationSelectorProps {
  value: 'vertical' | 'horizontal' | 'both';
  onChange: (value: 'vertical' | 'horizontal' | 'both') => void;
}

const SimpleOrientationSelector: React.FC<SimpleOrientationSelectorProps> = ({ value, onChange }) => {
  return (
    <RadioGroup 
      value={value} 
      onValueChange={onChange as (value: string) => void}
      className="flex justify-between"
    >
      <div className="flex flex-col items-center gap-1 p-2 border rounded-md hover:bg-accent cursor-pointer">
        <Columns className="h-5 w-5 text-primary" />
        <div className="flex items-center gap-1">
          <RadioGroupItem value="vertical" id="vertical" className="sr-only" />
          <Label htmlFor="vertical" className="text-xs cursor-pointer">Vertical</Label>
        </div>
      </div>
      
      <div className="flex flex-col items-center gap-1 p-2 border rounded-md hover:bg-accent cursor-pointer">
        <RowsIcon className="h-5 w-5 text-primary" />
        <div className="flex items-center gap-1">
          <RadioGroupItem value="horizontal" id="horizontal" className="sr-only" />
          <Label htmlFor="horizontal" className="text-xs cursor-pointer">Horizontal</Label>
        </div>
      </div>
      
      <div className="flex flex-col items-center gap-1 p-2 border rounded-md hover:bg-accent cursor-pointer">
        <Grid2X2 className="h-5 w-5 text-primary" />
        <div className="flex items-center gap-1">
          <RadioGroupItem value="both" id="both" className="sr-only" />
          <Label htmlFor="both" className="text-xs cursor-pointer">Both</Label>
        </div>
      </div>
    </RadioGroup>
  );
};

export default SimpleOrientationSelector;
