
import React from 'react';
import { Button } from "@/components/ui/button";
import { Copy, Palette } from 'lucide-react';

interface ColorItemProps {
  color: string;
  label?: string;
  subLabel?: string;
  onSelect: (color: string) => void;
  onCopy: (color: string) => void;
  onSave: (color: string) => void;
  size?: 'small' | 'medium' | 'large';
  showControls?: boolean;
}

const ColorItem: React.FC<ColorItemProps> = ({
  color,
  label,
  subLabel,
  onSelect,
  onCopy,
  onSave,
  size = 'medium',
  showControls = true
}) => {
  const handleClick = () => {
    onSelect(color);
  };

  const sizeClasses = {
    small: 'h-6 w-6 rounded-full',
    medium: 'h-8 w-12 rounded',
    large: 'h-12 w-full rounded'
  };

  return (
    <div className={size === 'large' ? 'flex flex-col items-center' : 'flex items-center gap-2'}>
      <button
        type="button"
        onClick={handleClick}
        className={`${sizeClasses[size]} overflow-hidden border shadow-sm transition hover:scale-105 relative group`}
        style={{ backgroundColor: color }}
        title={color}
      >
        {size === 'large' && (
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="h-6 w-6 bg-white bg-opacity-80 hover:bg-opacity-100"
                onClick={(e) => {
                  e.stopPropagation();
                  onCopy(color);
                }}
              >
                <Copy className="h-3 w-3" />
              </Button>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="h-6 w-6 bg-white bg-opacity-80 hover:bg-opacity-100"
                onClick={(e) => {
                  e.stopPropagation();
                  onSave(color);
                }}
              >
                <Palette className="h-3 w-3" />
              </Button>
            </div>
          </div>
        )}
      </button>
      
      {label && (
        <span className="text-xs flex-1">{label}</span>
      )}
      
      {subLabel && (
        <span className="text-xs text-muted-foreground w-16">
          {subLabel}
        </span>
      )}
      
      {showControls && size !== 'large' && size !== 'small' && (
        <>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="h-7 w-7"
            onClick={() => onCopy(color)}
          >
            <Copy className="h-3 w-3" />
          </Button>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="h-7 w-7"
            onClick={() => onSave(color)}
          >
            <Palette className="h-3 w-3" />
          </Button>
        </>
      )}
    </div>
  );
};

export default ColorItem;
