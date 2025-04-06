
import React, { useEffect } from 'react';
import { useBookshelfStore, initializeDefaultShelf } from '../store/bookshelfStore';
import BookshelfGrid from '../components/BookshelfGrid';
import BookModal from '../components/BookModal';
import BookSearchDrawer from '../components/BookSearchDrawer';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { BookOpen, PlusCircle, Edit2 } from "lucide-react";
import ShelfControls from '../components/ShelfControls';

const Index = () => {
  const { shelves, activeShelfId, switchShelf, addShelf, updateShelf } = useBookshelfStore();
  const [isNewShelfModalOpen, setIsNewShelfModalOpen] = React.useState(false);
  const [newShelfName, setNewShelfName] = React.useState("");
  const [isRenameModalOpen, setIsRenameModalOpen] = React.useState(false);
  const [renameValue, setRenameValue] = React.useState("");
  
  // Initialize the store
  useEffect(() => {
    const shelfId = initializeDefaultShelf();
    if (shelfId) {
      toast.success('Welcome to Ritual Bookshelf!', {
        description: 'Upload book covers by clicking on the "+" slots or drag and drop images.',
      });
    }
  }, []);
  
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
    <div className="min-h-screen flex flex-col">
      <header className="bg-wood-texture bg-cover shadow-md sticky top-0 z-30 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
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
                    {Object.values(shelves).map((shelf) => (
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
          </div>
          
          <div className="flex items-center space-x-3">
            <ShelfControls />
            <BookSearchDrawer />
          </div>
        </div>
      </header>
      
      <div className="flex-grow w-full overflow-auto">
        <BookshelfGrid />
      </div>
      
      <BookModal />
    </div>
  );
};

export default Index;
