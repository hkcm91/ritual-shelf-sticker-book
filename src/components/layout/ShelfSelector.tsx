import React, { useState } from 'react';
import { BookOpen, PlusCircle, Edit2, Sparkles } from "lucide-react";
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
    // Remove the setTimeout which was causing flickering issues
    // Just directly switch the shelf
    if (value !== activeShelfId) {
      switchShelf(value);
    }
  };
  
  return (
    <>
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="collections-title flex items-center gap-1.5 text-sm font-medium text-amber-300/90">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Collections</span>
          </h3>
        </div>
        
        <div className="w-full">
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
              // Keep dropdown open until user explicitly dismisses it
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

        <div className="flex justify-between gap-2 mt-1">
          <Button
            variant="ghost"
            onClick={() => {
              if (currentShelf) {
                setRenameValue(currentShelf.name);
                setIsRenameModalOpen(true);
              }
            }}
            disabled={!currentShelf}
            className="game-btn flex-1 text-xs h-8 from-amber-900/40 to-amber-950/40 hover:from-amber-900/50 hover:to-amber-950/50"
          >
            <Edit2 className="h-3.5 w-3.5 mr-1" />
            <span>Rename</span>
          </Button>

          <Button
            variant="ghost"
            onClick={() => setIsNewShelfModalOpen(true)}
            className="game-btn flex-1 text-xs h-8 from-amber-900/40 to-amber-950/40 hover:from-amber-900/50 hover:to-amber-950/50"
          >
            <PlusCircle className="h-3.5 w-3.5 mr-1" />
            <span>Create New</span>
          </Button>
        </div>
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
