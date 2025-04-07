
import React from 'react';
import { useBookshelfStore } from '@/store/bookshelfStore';
import { BookOpen, Sticker } from 'lucide-react';

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
  const { slots } = useBookshelfStore();
  
  // If not visible, don't render anything
  if (!isVisible) return null;
  
  return (
    <div className="slot-toggle-container absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
      <button
        className="toggle-dot flex items-center justify-center w-6 h-6 rounded-full border transition-colors duration-200"
        style={{
          backgroundColor: slotType === 'book' ? slots.toggleActiveColor : slots.toggleInactiveColor,
          borderColor: slots.toggleBorderColor
        }}
        onClick={(e) => {
          e.stopPropagation();
          handleTypeToggle('book');
        }}
        aria-label="Switch to book mode"
      >
        <BookOpen size={14} className="text-white" />
      </button>
      <button
        className="toggle-dot flex items-center justify-center w-6 h-6 rounded-full border transition-colors duration-200"
        style={{
          backgroundColor: slotType === 'sticker' ? slots.toggleActiveColor : slots.toggleInactiveColor,
          borderColor: slots.toggleBorderColor
        }}
        onClick={(e) => {
          e.stopPropagation();
          handleTypeToggle('sticker');
        }}
        aria-label="Switch to sticker mode"
      >
        <Sticker size={14} className="text-white" />
      </button>
    </div>
  );
};

export default SlotTypeToggle;
