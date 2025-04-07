
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import ShelfSelector from './ShelfSelector';
import { useBookshelfStore } from '@/store/bookshelfStore';
import ShelfControls from '../ShelfControls';

const Header: React.FC = () => {
  const { openCustomizationModal } = useBookshelfStore();
  
  return (
    <header className="px-4 py-2 flex justify-between items-center shadow-sm">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold">Ritual Bookshelf</h1>
        
        <div className="flex items-center gap-2">
          <ShelfSelector />
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <ShelfControls />
      </div>
    </header>
  );
};

export default Header;
