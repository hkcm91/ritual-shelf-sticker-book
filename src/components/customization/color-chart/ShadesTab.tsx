
import React from 'react';
import ColorItem from './ColorItem';

interface ShadesTabProps {
  shades: string[];
  onSelectColor: (color: string) => void;
  onCopyColor: (color: string) => void;
  onSaveColor: (color: string) => void;
}

const ShadesTab: React.FC<ShadesTabProps> = ({
  shades,
  onSelectColor,
  onCopyColor,
  onSaveColor
}) => {
  const getShadeLabel = (index: number): string => {
    if (index < 3) return `Shade ${3-index}`;
    if (index === 3) return 'Base';
    return `Tint ${index-3}`;
  };

  return (
    <div className="space-y-3 pt-2">
      <div className="space-y-2">
        {shades.map((color, index) => (
          <ColorItem
            key={`shade-${index}`}
            color={color}
            label={color}
            subLabel={getShadeLabel(index)}
            onSelect={onSelectColor}
            onCopy={onCopyColor}
            onSave={onSaveColor}
          />
        ))}
      </div>
    </div>
  );
};

export default ShadesTab;
