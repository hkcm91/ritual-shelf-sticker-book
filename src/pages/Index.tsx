
import React, { useEffect, useState } from 'react';
import { useBookshelfStore, initializeDefaultShelf } from '../store/bookshelfStore';
import BookshelfGrid from '../components/BookshelfGrid';
import BookModal from '../components/BookModal';
import { toast } from 'sonner';
import Header from '../components/layout/Header';
import ShelfDialogs from '../components/shelf/ShelfDialogs';
import { ShelfData } from '../store/types';
import { useTheme } from '@/hooks/useTheme';
import CustomizationModal from '@/components/customization/CustomizationModal';
import ZoomControls from '@/components/ZoomControls';

const Index = () => {
  const { shelves, activeShelfId, ui, page } = useBookshelfStore();
  const [isNewShelfModalOpen, setIsNewShelfModalOpen] = useState(false);
  const [newShelfName, setNewShelfName] = useState("");
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [renameValue, setRenameValue] = useState("");
  
  // Initialize the theme
  useTheme();
  
  // Initialize the store and load customization
  useEffect(() => {
    const shelfId = initializeDefaultShelf();
    
    // Load customization
    const loadSavedCustomization = useBookshelfStore.getState().loadCustomization;
    if (loadSavedCustomization) {
      loadSavedCustomization();
    }
    
    if (shelfId) {
      toast.success('Welcome to Ritual Bookshelf!', {
        description: 'Upload book covers by clicking on the "+" slots or drag and drop images.',
      });
    }
  }, []);

  const shelvesData = shelves as Record<string, ShelfData>;
  const currentShelf = activeShelfId ? shelvesData[activeShelfId] : null;
  
  // Apply page background styles
  const pageStyles = {
    backgroundColor: page?.background || '#f5f5f5',
    backgroundImage: page?.backgroundImage ? `url(${page.backgroundImage})` : 'none',
    backgroundSize: page?.backgroundSize || 'cover',
    backgroundRepeat: page?.backgroundRepeat || 'no-repeat',
    backgroundPosition: page?.backgroundPosition || 'center',
    backgroundAttachment: page?.backgroundAttachment || 'fixed'
  };
  
  return (
    <div className="min-h-screen flex flex-col" style={pageStyles}>
      <Header />
      
      <div className="flex-grow w-full overflow-auto">
        <BookshelfGrid />
      </div>
      
      {/* Zoom Controls */}
      <ZoomControls />
      
      <BookModal />
      
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
      
      <CustomizationModal 
        open={ui?.isCustomizationModalOpen || false} 
        onOpenChange={(open) => {
          const { openCustomizationModal, closeCustomizationModal } = useBookshelfStore.getState();
          if (open) {
            openCustomizationModal();
          } else {
            closeCustomizationModal();
          }
        }} 
      />
    </div>
  );
};

export default Index;
