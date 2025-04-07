
import React from 'react';
import ColorItem from './ColorItem';

interface HarmonyTabProps {
  harmonies: string[];
  onSelectColor: (color: string) => void;
  onCopyColor: (color: string) => void;
  onSaveColor: (color: string) => void;
}

const HarmonyTab: React.FC<HarmonyTabProps> = ({
  harmonies,
  onSelectColor,
  onCopyColor,
  onSaveColor
}) => {
  const getHarmonyLabel = (index: number): string => {
    switch (index) {
      case 0: return 'Base';
      case 1: return 'Complementary';
      case 2:
      case 3: return 'Triadic';
      default: return 'Analogous';
    }
  };

  return (
    <div className="space-y-3 pt-2">
      <div className="grid grid-cols-2 gap-2">
        {harmonies.map((color, index) => (
          <div key={`harmony-${index}`} className="flex flex-col items-center">
            <ColorItem
              color={color}
              onSelect={onSelectColor}
              onCopy={onCopyColor}
              onSave={onSaveColor}
              size="large"
            />
            <span className="text-xs mt-1">{color}</span>
            <span className="text-xxs text-muted-foreground">
              {getHarmonyLabel(index)}
            </span>
          </div>
        ))}
      </div>
      
      <div className="text-xs text-center text-muted-foreground">
        Click on a color to select it, or use the buttons to copy or save
      </div>
    </div>
  );
};

export default HarmonyTab;
