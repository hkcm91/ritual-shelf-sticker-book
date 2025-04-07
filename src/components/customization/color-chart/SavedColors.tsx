
import React from 'react';
import { Label } from "@/components/ui/label";
import ColorItem from './ColorItem';

interface SavedColorsProps {
  customColors: string[];
  onSelectColor: (color: string) => void;
}

const SavedColors: React.FC<SavedColorsProps> = ({
  customColors,
  onSelectColor
}) => {
  if (customColors.length === 0) {
    return null;
  }

  return (
    <div className="pt-2 border-t border-border">
      <Label className="text-xs mb-2">Saved Colors</Label>
      <div className="grid grid-cols-6 gap-1">
        {customColors.map((color, index) => (
          <ColorItem
            key={`custom-${index}`}
            color={color}
            onSelect={onSelectColor}
            onCopy={() => {}}
            onSave={() => {}}
            size="small"
            showControls={false}
          />
        ))}
      </div>
    </div>
  );
};

export default SavedColors;
