
import React from 'react';
import { Sparkles } from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useBookshelfStore } from '../../store/bookshelfStore';
import { ShelfData } from '../../store/types';

interface CollectionSelectorProps {
  onCollectionChange?: (id: string) => void;
  className?: string;
}

const CollectionSelector: React.FC<CollectionSelectorProps> = ({ 
  onCollectionChange,
  className = ''
}) => {
  const { shelves, activeShelfId, switchShelf } = useBookshelfStore();
  
  const shelvesData = shelves as Record<string, ShelfData>;
  
  const handleShelfChange = (value: string) => {
    if (value !== activeShelfId) {
      switchShelf(value);
      
      if (onCollectionChange) {
        onCollectionChange(value);
      }
    }
  };
  
  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="collections-title flex items-center gap-1.5 text-sm font-medium text-amber-300/90">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Collections</span>
        </h3>
      </div>
      
      <Select
        value={activeShelfId}
        onValueChange={handleShelfChange}
      >
        <SelectTrigger 
          className="w-full game-btn bg-gradient-to-b from-amber-900/40 to-amber-950/40 border border-amber-600/20 text-amber-100 
            shadow-lg shadow-black/30 hover:from-amber-900/50 hover:to-amber-950/50 transition-all"
        >
          <SelectValue placeholder="Select a collection..." />
        </SelectTrigger>
        <SelectContent 
          className="z-50 collections-dropdown min-w-[280px] p-1.5"
          position="popper"
          sideOffset={5}
          align="center"
          onCloseAutoFocus={(e) => {
            // Prevent auto focus which can cause dropdown to close
            e.preventDefault();
          }}
        >
          {Object.values(shelvesData).map((shelf) => (
            <SelectItem 
              key={shelf.id} 
              value={shelf.id}
              className="hover:bg-amber-800/30 px-3 py-2 rounded-md focus:bg-amber-800/30 cursor-pointer 
                border-l-2 border-transparent hover:border-amber-500/50 transition-all my-0.5 text-amber-100"
            >
              {shelf.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CollectionSelector;
