
import React from 'react';
import { Circle, Book, Sticker } from 'lucide-react';

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
    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-background/80 backdrop-blur-sm rounded-full p-1 z-10">
      <div className="flex items-center space-x-2">
        <button
          type="button"
          onClick={() => handleTypeToggle('book')}
          className={`rounded-full p-1 transition-colors ${slotType === 'book' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}
          aria-label="Book"
        >
          <Circle className="h-3 w-3" />
        </button>
        <button
          type="button"
          onClick={() => handleTypeToggle('sticker')}
          className={`rounded-full p-1 transition-colors ${slotType === 'sticker' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}
          aria-label="Sticker"
        >
          <Circle className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
};

export default SlotTypeToggle;
