
import React, { useEffect } from 'react';
import { useBookshelfStore, initializeDefaultShelf } from '../store/bookshelfStore';
import Header from '../components/Header';
import BookshelfGrid from '../components/BookshelfGrid';
import BookModal from '../components/BookModal';
import ShelfControls from '../components/ShelfControls';
import BookSearchDrawer from '../components/BookSearchDrawer';
import { toast } from 'sonner';

const Index = () => {
  // Initialize the store
  useEffect(() => {
    const shelfId = initializeDefaultShelf();
    if (shelfId) {
      toast.success('Welcome to Ritual Bookshelf!', {
        description: 'Upload book covers by clicking on the "+" slots or drag and drop images.',
      });
    }
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="px-4 py-3 sticky top-16 z-20 bg-background/90 backdrop-blur-sm border-b flex items-center justify-between">
        <ShelfControls />
        <BookSearchDrawer />
      </div>
      
      <div className="flex-grow w-full overflow-auto">
        <BookshelfGrid />
      </div>
      
      <BookModal />
    </div>
  );
};

export default Index;
