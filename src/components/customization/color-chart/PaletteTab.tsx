
import React from 'react';
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import ColorItem from './ColorItem';

interface PaletteTabProps {
  palette: string[];
  onSelectColor: (color: string) => void;
  onCopyColor: (color: string) => void;
  onSaveColor: (color: string) => void;
}

const PaletteTab: React.FC<PaletteTabProps> = ({
  palette,
  onSelectColor,
  onCopyColor,
  onSaveColor
}) => {
  const getPaletteLabel = (index: number): string => {
    switch (index) {
      case 0: return 'Primary';
      case 1: return 'Secondary';
      case 2: return 'Background';
      case 3: return 'Header';
      default: return 'Accent';
    }
  };

  const handleApplyPalette = () => {
    onSelectColor(palette[0]); // Primary
    toast.success("Primary color selected");
  };

  return (
    <div className="space-y-3 pt-2">
      <div className="space-y-2">
        {palette.map((color, index) => (
          <ColorItem
            key={`palette-${index}`}
            color={color}
            label={color}
            subLabel={getPaletteLabel(index)}
            onSelect={onSelectColor}
            onCopy={onCopyColor}
            onSave={onSaveColor}
          />
        ))}
      </div>
      
      <Button
        onClick={handleApplyPalette}
        variant="outline"
        size="sm"
        className="w-full mt-2"
      >
        Apply This Palette Theme
      </Button>
    </div>
  );
};

export default PaletteTab;
