
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
    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-background/50 backdrop-blur-sm rounded-full p-0.5 z-10 opacity-60 hover:opacity-100 transition-opacity">
      <div className="flex items-center space-x-1">
        <button
          type="button"
          onClick={() => handleTypeToggle('book')}
          className={`rounded-full p-0.5 transition-colors ${slotType === 'book' ? 'bg-primary/70 text-white' : 'bg-gray-200/50 text-gray-500 hover:bg-gray-300/60'}`}
          aria-label="Book"
        >
          <Circle className="h-2 w-2" />
        </button>
        <button
          type="button"
          onClick={() => handleTypeToggle('sticker')}
          className={`rounded-full p-0.5 transition-colors ${slotType === 'sticker' ? 'bg-primary/70 text-white' : 'bg-gray-200/50 text-gray-500 hover:bg-gray-300/60'}`}
          aria-label="Sticker"
        >
          <Circle className="h-2 w-2" />
        </button>
      </div>
    </div>
  );
};

export default SlotTypeToggle;
