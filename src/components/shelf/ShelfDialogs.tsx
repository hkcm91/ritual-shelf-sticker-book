
import React from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useBookshelfStore } from '../../store/bookshelfStore';

type ShelfDialogsProps = {
  isNewShelfModalOpen: boolean;
  setIsNewShelfModalOpen: (open: boolean) => void;
  newShelfName: string;
  setNewShelfName: (name: string) => void;
  isRenameModalOpen: boolean;
  setIsRenameModalOpen: (open: boolean) => void;
  renameValue: string;
  setRenameValue: (value: string) => void;
};

const ShelfDialogs: React.FC<ShelfDialogsProps> = ({
  isNewShelfModalOpen,
  setIsNewShelfModalOpen,
  newShelfName,
  setNewShelfName,
  isRenameModalOpen,
  setIsRenameModalOpen,
  renameValue,
  setRenameValue
}) => {
  const { addShelf, activeShelfId, updateShelf } = useBookshelfStore();

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

export default ShelfDialogs;
