
import React from 'react';
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Edit2 } from "lucide-react";
import { useBookshelfStore } from '../../store/bookshelfStore';
import { ShelfData } from '../../store/types';

type ShelfSelectorProps = {
  currentShelf: ShelfData | null;
  setIsRenameModalOpen: (open: boolean) => void;
  setRenameValue: (value: string) => void;
  setIsNewShelfModalOpen: (open: boolean) => void;
};

const ShelfSelector: React.FC<ShelfSelectorProps> = ({
  currentShelf,
  setIsRenameModalOpen,
  setRenameValue,
  setIsNewShelfModalOpen
}) => {
  const { shelves, activeShelfId, switchShelf } = useBookshelfStore();
  const shelvesData = shelves as Record<string, ShelfData>;
  
  return (
    <>
      <BookOpen className="h-5 w-5 text-white/90" />
      
      <div className="flex items-center gap-2">
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

        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            if (currentShelf) {
              setRenameValue(currentShelf.name);
              setIsRenameModalOpen(true);
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
          onClick={() => setIsNewShelfModalOpen(true)}
          className="bg-white/90 hover:bg-white text-gray-700"
        >
          <PlusCircle className="h-4 w-4" />
        </Button>
      </div>
    </>
  );
};

export default ShelfSelector;
