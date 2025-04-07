
import React from 'react';
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Edit2 } from "lucide-react";
import { useBookshelfStore } from '../../store/bookshelfStore';
import { ShelfData } from '../../store/types';

const ShelfSelector: React.FC = () => {
  const { shelves, activeShelfId, switchShelf, openModal } = useBookshelfStore();
  const shelvesData = shelves as Record<string, ShelfData>;
  
  // Find the current shelf from the store
  const currentShelf = activeShelfId ? shelvesData[activeShelfId] : null;
  
  return (
    <div className="flex items-center gap-2">
      <BookOpen className="h-5 w-5 text-white/90" />
      
      <div className="w-48">
        <Select
          value={activeShelfId}
          onValueChange={(value) => switchShelf(value)}
        >
          <SelectTrigger className="bg-white/90 border-0">
            <SelectValue placeholder="Select a shelf..." />
          </SelectTrigger>
          <SelectContent>
            {Object.values(shelvesData).map((shelf) => (
              <SelectItem key={shelf.id} value={shelf.id}>
                {shelf.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* These buttons will use the openModal function from the store instead of 
          relying on props passed from the parent */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => {
          if (currentShelf) {
            // We'd need a way to open a rename modal via the store
            console.log("Open rename modal for:", currentShelf.name);
          }
        }}
        disabled={!currentShelf}
        className="bg-white/90 hover:bg-white text-gray-700"
      >
        <Edit2 className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => {
          // Open new shelf modal via store
          console.log("Open new shelf modal");
        }}
        className="bg-white/90 hover:bg-white text-gray-700"
      >
        <PlusCircle className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ShelfSelector;
