
import React, { useEffect, useState } from 'react';
import { useBookshelfStore, initializeDefaultShelf } from '../store/bookshelfStore';
import BookshelfGrid from '../components/BookshelfGrid';
import BookModal from '../components/BookModal';
import { toast } from 'sonner';
import Header from '../components/layout/Header';
import ShelfDialogs from '../components/shelf/ShelfDialogs';
import { ShelfData } from '../store/types';
import CustomizationModal from '@/components/customization/CustomizationModal';
import ZoomControls from '@/components/ZoomControls';

const Index = () => {
  const { shelves, activeShelfId, ui, openCustomizationModal, closeCustomizationModal } = useBookshelfStore();
  const [isNewShelfModalOpen, setIsNewShelfModalOpen] = useState(false);
  const [newShelfName, setNewShelfName] = useState("");
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [renameValue, setRenameValue] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);
  const [localCustomizationOpen, setLocalCustomizationOpen] = useState(false);
  
  // Initialize the store and load customization only once
  useEffect(() => {
    if (!isInitialized) {
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
      
      setIsInitialized(true);
    }
  }, [isInitialized]);

  // Sync store state with local state
  useEffect(() => {
    console.log("Index: UI customization modal state changed:", ui?.isCustomizationModalOpen);
    setLocalCustomizationOpen(ui?.isCustomizationModalOpen || false);
  }, [ui?.isCustomizationModalOpen]);

  const shelvesData = shelves as Record<string, ShelfData>;
  const currentShelf = activeShelfId ? shelvesData[activeShelfId] : null;
  
  const handleCustomizationOpenChange = (newOpen: boolean) => {
    console.log("Index: handleCustomizationOpenChange called with:", newOpen);
    if (newOpen) {
      openCustomizationModal();
    } else {
      closeCustomizationModal();
    }
    setLocalCustomizationOpen(newOpen);
  };
  
  return (
    <div 
      className="min-h-screen flex flex-col"
      style={{
        backgroundColor: 'var(--page-bg, #f5f5f5)',
        backgroundImage: 'var(--page-bg-image, none)',
        backgroundSize: 'var(--page-bg-size, cover)',
        backgroundRepeat: 'var(--page-bg-repeat, no-repeat)',
        backgroundPosition: 'var(--page-bg-position, center)',
        backgroundAttachment: 'var(--page-bg-attachment, fixed)',
        color: 'var(--page-text-color, #333333)'
      }}
    >
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
      
      {/* Use local state to control the modal */}
      <CustomizationModal 
        open={localCustomizationOpen} 
        onOpenChange={handleCustomizationOpenChange} 
      />
    </div>
  );
};

export default Index;
