
import React, { useState } from 'react';
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PipetteIcon } from "lucide-react";

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  disabled?: boolean;
  allowAlpha?: boolean;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ 
  color,
  onChange,
  disabled = false,
  allowAlpha = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <Popover open={isOpen && !disabled} onOpenChange={setIsOpen}>
      <div className="flex gap-2 items-center">
        <PopoverTrigger asChild>
          <Button 
            type="button" 
            variant="outline" 
            className="w-12 h-8 p-1 border-2"
            style={{ backgroundColor: color }}
            disabled={disabled}
          />
        </PopoverTrigger>
        
        <Input
          type="text"
          value={color}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1"
          disabled={disabled}
        />
        
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => setIsOpen(true)}
          disabled={disabled}
        >
          <PipetteIcon className="h-4 w-4" />
        </Button>
      </div>
      
      <PopoverContent className="w-64 p-4">
        <div className="space-y-4">
          <div>
            <Input
              type="color"
              value={allowAlpha ? color.replace(/rgba?\(.*?\)/, '#000000') : color}
              onChange={(e) => onChange(e.target.value)}
              className="w-full h-12"
            />
          </div>
          
          {allowAlpha && (
            <div className="space-y-2">
              <label className="text-xs font-medium">Transparency</label>
              <Input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={color.includes('rgba') 
                  ? color.match(/rgba\(\d+,\s*\d+,\s*\d+,\s*([\d.]+)/)?.[1] || "1" 
                  : "1"}
                onChange={(e) => {
                  const hexColor = color.replace(/rgba?\(.*?\)/, '').trim();
                  const rgbMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
                  
                  if (rgbMatch) {
                    const r = rgbMatch[1];
                    const g = rgbMatch[2];
                    const b = rgbMatch[3];
                    onChange(`rgba(${r}, ${g}, ${b}, ${e.target.value})`);
                  } else if (hexColor.startsWith('#')) {
                    // Convert hex to rgba
                    const hex = hexColor.substring(1);
                    const r = parseInt(hex.substring(0, 2), 16);
                    const g = parseInt(hex.substring(2, 4), 16);
                    const b = parseInt(hex.substring(4, 6), 16);
                    onChange(`rgba(${r}, ${g}, ${b}, ${e.target.value})`);
                  }
                }}
                className="w-full"
              />
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ColorPicker;
