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
  // Local state for customization modal
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  
  console.log("[Index] Rendering with UI state:", ui);
  
  // Initialize the store and load customization only once
  useEffect(() => {
    if (!isInitialized) {
      console.log("[Index] Initializing default shelf");
      const shelfId = initializeDefaultShelf();
      
      // Get the loadCustomization function
      const loadSavedCustomization = useBookshelfStore.getState().loadCustomization;
      if (loadSavedCustomization) {
        console.log("[Index] Loading saved customization");
        // The function doesn't accept any arguments, so call it with no parameters
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

  // Sync with store for modal state
  useEffect(() => {
    console.log("[Index] Setting up subscription");
    const unsubscribe = useBookshelfStore.subscribe((state) => {
      const isOpen = state.ui?.isCustomizationModalOpen;
      console.log("[Index] Store subscription triggered - modal state changed to:", isOpen);
      setIsCustomModalOpen(isOpen);
    });
    
    return () => {
      console.log("[Index] Cleaning up subscription");
      unsubscribe();
    };
  }, []);
  
  // Let's add extra debug logging for the modal state
  useEffect(() => {
    console.log("[Index DEBUG] Current local modal state:", isCustomModalOpen);
    console.log("[Index DEBUG] Current store modal state:", ui?.isCustomizationModalOpen);
  }, [isCustomModalOpen, ui?.isCustomizationModalOpen]);
  
  const shelvesData = shelves as Record<string, ShelfData>;
  const currentShelf = activeShelfId ? shelvesData[activeShelfId] : null;
  
  const handleCustomizationOpenChange = (newOpen: boolean) => {
    console.log("[Index] handleCustomizationOpenChange called with:", newOpen);
    
    if (newOpen) {
      openCustomizationModal();
    } else {
      closeCustomizationModal();
    }
    
    // Directly set local state too for immediate feedback
    setIsCustomModalOpen(newOpen);
  };
  
  // Force open modal with keyboard debugging
  useEffect(() => {
    const forceOpenWithKeyboard = (e: KeyboardEvent) => {
      if (e.key === 'o' && e.ctrlKey && e.altKey) {
        console.log("[Index] Force opening modal with keyboard shortcut");
        openCustomizationModal();
        setIsCustomModalOpen(true);
        toast.success("Forced modal open with keyboard shortcut");
      }
    };
    
    window.addEventListener('keydown', forceOpenWithKeyboard);
    return () => window.removeEventListener('keydown', forceOpenWithKeyboard);
  }, [openCustomizationModal]);
  
  // Emergency debug function to directly toggle modal
  const forceToggleModal = () => {
    const newState = !isCustomModalOpen;
    console.log("[Index] Force toggling modal to:", newState);
    setIsCustomModalOpen(newState);
    if (newState) {
      openCustomizationModal();
    } else {
      closeCustomizationModal();
    }
    toast.success(`Modal state forced to: ${newState ? 'OPEN' : 'CLOSED'}`);
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
      
      {/* Always render the modal but control visibility with the open prop */}
      <div style={{ position: 'relative', zIndex: 9999 }}>
        <CustomizationModal 
          open={isCustomModalOpen} 
          onOpenChange={handleCustomizationOpenChange} 
        />
      </div>
      
      {/* Emergency floating controls */}
      <div className="fixed bottom-0 left-0 bg-black/80 text-white text-xs p-2 z-[9999] max-w-[350px] overflow-hidden">
        <div>Modal state: {isCustomModalOpen ? 'OPEN' : 'CLOSED'}</div>
        <div>Store state: {ui?.isCustomizationModalOpen ? 'OPEN' : 'CLOSED'}</div>
        <button 
          onClick={forceToggleModal}
          className="mt-1 bg-blue-500 px-2 py-1 rounded w-full text-center"
        >
          Force Toggle Modal (Currently: {isCustomModalOpen ? 'OPEN' : 'CLOSED'})
        </button>
      </div>
    </div>
  );
};

export default Index;
