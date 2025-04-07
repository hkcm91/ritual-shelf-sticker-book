
import React, { useState } from 'react';
import { BookOpen, PlusCircle, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useBookshelfStore } from '../../store/bookshelfStore';
import { ShelfData } from '../../store/types';
import ShelfDialogs from '../shelf/ShelfDialogs';

const ShelfSelector: React.FC = () => {
  const { shelves, activeShelfId, switchShelf } = useBookshelfStore();
  const [isNewShelfModalOpen, setIsNewShelfModalOpen] = useState(false);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [newShelfName, setNewShelfName] = useState("");
  const [renameValue, setRenameValue] = useState("");
  
  const shelvesData = shelves as Record<string, ShelfData>;
  
  // Find the current shelf from the store
  const currentShelf = activeShelfId ? shelvesData[activeShelfId] : null;
  
  const handleShelfChange = (value: string) => {
    // Add a small delay to prevent race conditions with selection events
    setTimeout(() => {
      switchShelf(value);
    }, 100);
  };
  
  return (
    <>
      <div className="flex items-center gap-2">
        <BookOpen className="h-5 w-5 text-white/90" />
        
        <div className="w-48">
          <Select
            value={activeShelfId}
            onValueChange={handleShelfChange}
          >
            <SelectTrigger className="bg-[#1A1F2C]/90 border border-white/10 text-white hover:bg-[#222836] transition-colors shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)]">
              <SelectValue placeholder="Select a collection..." />
            </SelectTrigger>
            <SelectContent className="z-50 bg-[#1A1F2C] border border-white/10 text-white shadow-[0_8px_16px_rgba(0,0,0,0.5)]">
              {Object.values(shelvesData).map((shelf) => (
                <SelectItem 
                  key={shelf.id} 
                  value={shelf.id}
                  className="hover:bg-[#2C354A] focus:bg-[#2C354A] cursor-pointer"
                >
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
          className="bg-[#1A1F2C]/80 hover:bg-[#222836] text-white/80 hover:text-white border border-white/10 shadow-md"
        >
          <Edit2 className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsNewShelfModalOpen(true)}
          className="bg-[#1A1F2C]/80 hover:bg-[#222836] text-white/80 hover:text-white border border-white/10 shadow-md"
        >
          <PlusCircle className="h-4 w-4" />
        </Button>
      </div>
      
      <ShelfDialogs 
        isNewShelfModalOpen={isNewShelfModalOpen}
        setIsNewShelfModalOpen={setIsNewShelfModalOpen}
        newShelfName={newShelfName}
        setNewShelfName={setNewShelfName}
        isRenameModalOpen={isRenameModalOpen}
        setIsRenameModalOpen={setIsRenameModalOpen}
        renameValue={renameValue}
        setRenameValue={setRenameValue}
      />
    </>
  );
};

export default ShelfSelector;
