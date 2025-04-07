
import React, { useState } from 'react';
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Edit2 } from "lucide-react";
import { useBookshelfStore } from '../../store/bookshelfStore';
import { ShelfData } from '../../store/types';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const ShelfSelector: React.FC = () => {
  const { shelves, activeShelfId, switchShelf, addShelf, updateShelf } = useBookshelfStore();
  const [isNewShelfModalOpen, setIsNewShelfModalOpen] = useState(false);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [newShelfName, setNewShelfName] = useState("");
  const [renameValue, setRenameValue] = useState("");
  
  const shelvesData = shelves as Record<string, ShelfData>;
  
  // Find the current shelf from the store
  const currentShelf = activeShelfId ? shelvesData[activeShelfId] : null;
  
  const handleAddShelf = () => {
    if (newShelfName.trim()) {
      addShelf({
        name: newShelfName.trim(),
        rows: 2,
        columns: 4
      });
      setNewShelfName("");
      setIsNewShelfModalOpen(false);
    }
  };

  const handleRename = () => {
    if (renameValue.trim() && activeShelfId) {
      updateShelf(activeShelfId, { name: renameValue.trim() });
      setRenameValue("");
      setIsRenameModalOpen(false);
    }
  };
  
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
      
      {/* New Shelf Dialog */}
      <Dialog open={isNewShelfModalOpen} onOpenChange={setIsNewShelfModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Shelf</DialogTitle>
          </DialogHeader>
          <div className="my-4">
            <Input
              placeholder="Shelf Name"
              value={newShelfName}
              onChange={(e) => setNewShelfName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddShelf()}
            />
          </div>
          <DialogFooter>
            <Button onClick={handleAddShelf}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rename Shelf Dialog */}
      <Dialog open={isRenameModalOpen} onOpenChange={setIsRenameModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Shelf</DialogTitle>
          </DialogHeader>
          <div className="my-4">
            <Input
              placeholder="New Name"
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleRename()}
            />
          </div>
          <DialogFooter>
            <Button onClick={handleRename}>Rename</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ShelfSelector;
