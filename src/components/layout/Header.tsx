
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, Pencil } from 'lucide-react';
import ShelfSelector from './ShelfSelector';
import { ShelfData } from '@/store/types';

export interface HeaderProps {
  currentShelf: ShelfData | null;
  setIsNewShelfModalOpen: (isOpen: boolean) => void;
  setIsRenameModalOpen: (isOpen: boolean) => void;
  setRenameValue: (value: string) => void;
}

const Header: React.FC<HeaderProps> = ({
  currentShelf,
  setIsNewShelfModalOpen,
  setIsRenameModalOpen,
  setRenameValue
}) => {
  const handleRenameClick = () => {
    if (currentShelf) {
      setRenameValue(currentShelf.name);
      setIsRenameModalOpen(true);
    }
  };

  return (
    <header className="px-4 py-2 flex justify-between items-center shadow-sm">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold">Ritual Bookshelf</h1>
        
        <div className="flex items-center gap-2">
          <ShelfSelector />
          
          {currentShelf && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRenameClick}
              className="rounded-full"
              title="Rename Shelf"
            >
              <Pencil className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Button 
          size="sm"
          onClick={() => setIsNewShelfModalOpen(true)}
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          New Shelf
        </Button>
      </div>
    </header>
  );
};

export default Header;
