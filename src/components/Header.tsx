
import { useState } from "react";
import { useBookshelfStore, initializeDefaultShelf } from "@/store/bookshelfStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function Header() {
  const { shelves, activeShelfId, switchShelf, addShelf, updateShelf } = useBookshelfStore();
  const [isNewShelfModalOpen, setIsNewShelfModalOpen] = useState(false);
  const [newShelfName, setNewShelfName] = useState("");
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [renameValue, setRenameValue] = useState("");

  // Initialize default shelf if needed
  if (Object.keys(shelves).length === 0) {
    initializeDefaultShelf();
  }

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

  const currentShelf = shelves[activeShelfId];

  return (
    <header className="bg-wood-texture bg-cover border-b shadow-md sticky top-0 z-10">
      <div className="container mx-auto py-3 md:py-4 px-4 flex flex-col md:flex-row justify-between items-center">
        <div className="flex flex-col items-center md:items-start mb-3 md:mb-0">
          <h1 className="text-2xl md:text-3xl font-bold text-white drop-shadow-md">
            Ritual Bookshelf
          </h1>
          <p className="text-sm text-white/80 text-center md:text-left">
            Track your reading journey with a beautiful digital bookshelf
          </p>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <div className="w-40 md:w-48">
            <Select
              value={activeShelfId}
              onValueChange={(value) => switchShelf(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a shelf..." />
              </SelectTrigger>
              <SelectContent>
                {Object.values(shelves).map((shelf) => (
                  <SelectItem key={shelf.id} value={shelf.id}>
                    {shelf.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (currentShelf) {
                setRenameValue(currentShelf.name);
                setIsRenameModalOpen(true);
              }
            }}
            disabled={!currentShelf}
            className="bg-white/80 hover:bg-white"
          >
            Rename
          </Button>

          <Button
            variant="default"
            size="sm"
            onClick={() => setIsNewShelfModalOpen(true)}
          >
            New Shelf
          </Button>
        </div>
      </div>

      {/* New Shelf Modal */}
      <Dialog open={isNewShelfModalOpen} onOpenChange={setIsNewShelfModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Shelf</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="name" className="text-right">
                Shelf Name
              </label>
              <Input
                id="name"
                value={newShelfName}
                onChange={(e) => setNewShelfName(e.target.value)}
                className="col-span-3"
                placeholder="My Reading List"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewShelfModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddShelf}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rename Shelf Modal */}
      <Dialog open={isRenameModalOpen} onOpenChange={setIsRenameModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Rename Shelf</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="rename" className="text-right">
                New Name
              </label>
              <Input
                id="rename"
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRenameModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRename}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  );
}

export default Header;
