
import React from 'react';
import { Circle } from 'lucide-react';

type SlotTypeToggleProps = {
  slotType: "book" | "sticker";
  handleTypeToggle: (value: string) => void;
  isVisible?: boolean;
};

const SlotTypeToggle: React.FC<SlotTypeToggleProps> = ({ 
  slotType, 
  handleTypeToggle,
  isVisible = true
}) => {
  // If not visible, don't render anything
  if (!isVisible) return null;
  
  return (
    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-background/30 backdrop-blur-sm rounded-full p-0.5 z-10 opacity-40 hover:opacity-90 transition-opacity">
      <div className="flex items-center space-x-1">
        <button
          type="button"
          onClick={() => handleTypeToggle('book')}
          className={`rounded-full transition-all duration-200 ${slotType === 'book' ? 'scale-110' : 'scale-100'}`}
          aria-label="Book"
        >
          <div className={`h-2 w-2 rounded-full transition-all duration-200 ${
            slotType === 'book' 
              ? 'bg-amber-400/90 shadow-[0_0_6px_rgba(251,191,36,0.7)]' 
              : 'bg-gray-400/40'
          }`} />
        </button>
        <button
          type="button"
          onClick={() => handleTypeToggle('sticker')}
          className={`rounded-full transition-all duration-200 ${slotType === 'sticker' ? 'scale-110' : 'scale-100'}`}
          aria-label="Sticker"
        >
          <div className={`h-2 w-2 rounded-full transition-all duration-200 ${
            slotType === 'sticker' 
              ? 'bg-amber-400/90 shadow-[0_0_6px_rgba(251,191,36,0.7)]' 
              : 'bg-gray-400/40'
          }`} />
        </button>
      </div>
    </div>
  );
};

export default SlotTypeToggle;
