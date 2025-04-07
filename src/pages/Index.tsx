
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
  console.log("[Index] Store modal state:", useBookshelfStore.getState().ui?.isCustomizationModalOpen);
  console.log("[Index] Local modal state:", isCustomModalOpen);
  
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

  // Sync with store for modal state
  useEffect(() => {
    const storeState = useBookshelfStore.getState().ui?.isCustomizationModalOpen;
    console.log("[Index] Syncing modal state with store:", storeState);
    if (storeState !== isCustomModalOpen) {
      setIsCustomModalOpen(!!storeState);
    }
  }, []);

  // Subscribe to store changes for modal state
  useEffect(() => {
    console.log("[Index] Setting up subscription to customization modal state");
    const unsubscribe = useBookshelfStore.subscribe((state) => {
      const isOpen = state.ui?.isCustomizationModalOpen;
      console.log("[Index] Store subscription triggered - modal state changed to:", isOpen);
      if (isOpen !== isCustomModalOpen) {
        console.log("[Index] Updating local state to match store");
        setIsCustomModalOpen(!!isOpen);
      }
    });
    
    return unsubscribe;
  }, [isCustomModalOpen]);

  const shelvesData = shelves as Record<string, ShelfData>;
  const currentShelf = activeShelfId ? shelvesData[activeShelfId] : null;
  
  const handleCustomizationOpenChange = (newOpen: boolean) => {
    console.log("[Index] handleCustomizationOpenChange called with:", newOpen);
    console.log("[Index] Current store state before change:", useBookshelfStore.getState().ui?.isCustomizationModalOpen);
    
    setIsCustomModalOpen(newOpen);
    
    if (newOpen) {
      openCustomizationModal();
    } else {
      closeCustomizationModal();
    }
    
    // Force a store update to ensure reactivity
    useBookshelfStore.setState(state => ({
      ...state,
      ui: {
        ...state.ui,
        isCustomizationModalOpen: newOpen
      }
    }));
    
    // Check if state was updated correctly
    setTimeout(() => {
      console.log("[Index] Store state after change:", useBookshelfStore.getState().ui?.isCustomizationModalOpen);
    }, 100);
  };
  
  // Force open modal with ESC key debugging
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
      
      {/* Use direct state for the modal */}
      <CustomizationModal 
        open={isCustomModalOpen} 
        onOpenChange={handleCustomizationOpenChange} 
      />
      
      {/* Debug info at the bottom of the page */}
      <div className="fixed bottom-0 left-0 bg-black/80 text-white text-xs p-1 z-50 max-w-[300px] overflow-hidden">
        Modal state: {isCustomModalOpen ? 'Open' : 'Closed'} | 
        Store state: {ui?.isCustomizationModalOpen ? 'Open' : 'Closed'} | 
        <button 
          onClick={() => {
            openCustomizationModal();
            setIsCustomModalOpen(true);
          }}
          className="ml-1 bg-blue-500 px-1 rounded"
        >
          Force Open
        </button>
      </div>
    </div>
  );
};

export default Index;
