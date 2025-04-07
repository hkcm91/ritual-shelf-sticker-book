
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Save, RefreshCw } from "lucide-react";

interface ColorControlsProps {
  currentColor: string;
  inputColor: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCopyColor: (color: string) => void;
  onSaveColor: (color: string) => void;
  onRandomColor: () => void;
}

const ColorControls: React.FC<ColorControlsProps> = ({
  currentColor,
  inputColor,
  onInputChange,
  onCopyColor,
  onSaveColor,
  onRandomColor
}) => {
  return (
    <div className="flex items-center mb-3 gap-2">
      <div 
        className="w-8 h-8 rounded border"
        style={{ backgroundColor: currentColor }}
      />
      <div className="flex-1">
        <Input
          type="text"
          value={inputColor}
          onChange={onInputChange}
          className="font-mono"
          maxLength={7}
        />
      </div>
      <Button 
        onClick={() => onCopyColor(currentColor)} 
        size="icon" 
        variant="outline"
        className="h-8 w-8"
      >
        <Copy className="h-4 w-4" />
      </Button>
      <Button 
        onClick={() => onSaveColor(currentColor)} 
        size="icon" 
        variant="outline"
        className="h-8 w-8"
      >
        <Save className="h-4 w-4" />
      </Button>
      <Button 
        onClick={onRandomColor} 
        size="icon" 
        variant="outline"
        className="h-8 w-8"
      >
        <RefreshCw className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ColorControls;
