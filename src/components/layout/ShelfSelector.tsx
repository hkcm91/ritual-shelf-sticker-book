
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
  
  return (
    <>
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
            <SelectContent className="z-50 bg-white">
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
