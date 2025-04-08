
import React from 'react';
import { Book, Sticker, Utensils } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface SlotTypeToggleProps {
  slotType: string;
  handleTypeToggle: (value: string) => void;
  isVisible: boolean;
}

const SlotTypeToggle: React.FC<SlotTypeToggleProps> = ({ slotType, handleTypeToggle, isVisible }) => {
  if (!isVisible) return null;
  
  return (
    <div className="absolute bottom-2 left-0 right-0 flex justify-center">
      <ToggleGroup 
        type="single" 
        value={slotType} 
        onValueChange={(value) => value && handleTypeToggle(value)}
        className="bg-gray-800/40 backdrop-blur-sm rounded-full p-1"
      >
        <ToggleGroupItem 
          value="book" 
          className="h-7 w-7 p-0 data-[state=on]:bg-amber-600/70 rounded-full"
          aria-label="Book"
        >
          <Book className="h-3.5 w-3.5" />
        </ToggleGroupItem>
        
        <ToggleGroupItem 
          value="sticker" 
          className="h-7 w-7 p-0 data-[state=on]:bg-amber-600/70 rounded-full"
          aria-label="Sticker"
        >
          <Sticker className="h-3.5 w-3.5" />
        </ToggleGroupItem>
        
        <ToggleGroupItem 
          value="recipe" 
          className="h-7 w-7 p-0 data-[state=on]:bg-amber-600/70 rounded-full"
          aria-label="Recipe"
        >
          <Utensils className="h-3.5 w-3.5" />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};

export default SlotTypeToggle;
