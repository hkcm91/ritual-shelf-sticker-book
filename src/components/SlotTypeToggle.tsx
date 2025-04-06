
import React from 'react';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Book, Sticker } from "lucide-react";

type SlotTypeToggleProps = {
  slotType: "book" | "sticker";
  handleTypeToggle: (value: string) => void;
};

const SlotTypeToggle: React.FC<SlotTypeToggleProps> = ({ 
  slotType, 
  handleTypeToggle 
}) => {
  return (
    <div 
      className="absolute bottom-1 left-0 right-0 z-10 flex justify-center"
      onClick={(e) => e.stopPropagation()}
    >
      <ToggleGroup 
        type="single" 
        value={slotType} 
        onValueChange={handleTypeToggle}
        className="flex space-x-1 pointer-events-auto"
      >
        <ToggleGroupItem 
          value="book" 
          aria-label="Book Slot" 
          className="slot-toggle-dot"
          title="Book"
        >
          <span className="sr-only">Book</span>
        </ToggleGroupItem>
        <ToggleGroupItem 
          value="sticker" 
          aria-label="Sticker Slot" 
          className="slot-toggle-dot"
          title="Sticker"
        >
          <span className="sr-only">Sticker</span>
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};

export default SlotTypeToggle;
