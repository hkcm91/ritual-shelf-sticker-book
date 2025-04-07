
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import ShelfSelector from './ShelfSelector';
import { useBookshelfStore } from '@/store/bookshelfStore';

const Header: React.FC = () => {
  const { shelves, activeShelfId } = useBookshelfStore();
  const [isNewShelfModalOpen, setIsNewShelfModalOpen] = useState(false);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [renameValue, setRenameValue] = useState('');

  // Get the current shelf from the store
  const currentShelf = activeShelfId ? shelves[activeShelfId] : null;

  return (
    <header className="px-4 py-2 flex justify-between items-center shadow-sm">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold">Ritual Bookshelf</h1>
        
        <div className="flex items-center gap-2">
          <ShelfSelector />
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
