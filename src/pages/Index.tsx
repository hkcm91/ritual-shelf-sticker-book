
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
  
  console.log("[Index] Rendering with UI state:", ui);
  
  // Initialize the store and load customization only once
  useEffect(() => {
    if (!isInitialized) {
      console.log("[Index] Initializing default shelf");
      const shelfId = initializeDefaultShelf();
      
      // Load customization
      const loadSavedCustomization = useBookshelfStore.getState().loadCustomization;
      if (loadSavedCustomization) {
        console.log("[Index] Loading saved customization");
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

  const shelvesData = shelves as Record<string, ShelfData>;
  const currentShelf = activeShelfId ? shelvesData[activeShelfId] : null;
  
  // Get the customization modal state directly from the store
  const isCustomizationModalOpen = ui?.isCustomizationModalOpen || false;
  console.log("[Index] Customization modal state:", isCustomizationModalOpen);
  
  // Force re-render when customization modal state changes
  useEffect(() => {
    console.log("[Index] Setting up subscription to customization modal state");
    const unsubscribe = useBookshelfStore.subscribe(
      (state) => state.ui?.isCustomizationModalOpen,
      (isOpen) => {
        console.log("[Index] Customization modal state changed to:", isOpen);
        // No action needed, just logging
      }
    );
    
    return () => {
      console.log("[Index] Cleaning up subscription");
      unsubscribe();
    };
  }, []);
  
  const handleCustomizationOpenChange = (newOpen: boolean) => {
    console.log("[Index] handleCustomizationOpenChange called with:", newOpen);
    console.log("[Index] Current store state before change:", useBookshelfStore.getState().ui?.isCustomizationModalOpen);
    
    if (newOpen) {
      openCustomizationModal();
    } else {
      closeCustomizationModal();
    }
    
    // Check if state was updated correctly
    setTimeout(() => {
      console.log("[Index] Store state after change:", useBookshelfStore.getState().ui?.isCustomizationModalOpen);
    }, 100);
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
      
      {/* Use direct state from the store for the modal */}
      <CustomizationModal 
        open={isCustomizationModalOpen} 
        onOpenChange={handleCustomizationOpenChange} 
      />
      
      {/* Debug info at the bottom of the page */}
      <div className="fixed bottom-0 left-0 bg-black/80 text-white text-xs p-1 z-50 max-w-[300px] overflow-hidden">
        Modal state: {isCustomizationModalOpen ? 'Open' : 'Closed'}
      </div>
    </div>
  );
};

export default Index;
