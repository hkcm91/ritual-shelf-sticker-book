
import React from 'react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Book, Sticker } from 'lucide-react';

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
      <ToggleGroup 
        type="single" 
        value={slotType} 
        onValueChange={handleTypeToggle}
        size="sm"
      >
        <ToggleGroupItem value="book" aria-label="Book">
          <Book className="h-3 w-3" />
        </ToggleGroupItem>
        <ToggleGroupItem value="sticker" aria-label="Sticker">
          <Sticker className="h-3 w-3" />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};

export default SlotTypeToggle;
