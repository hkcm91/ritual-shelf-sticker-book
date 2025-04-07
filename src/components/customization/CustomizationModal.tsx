
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { useBookshelfStore } from "@/store/bookshelfStore";
import { toast } from 'sonner';
import ModalHeader from './modal/ModalHeader';
import PreviewSection from './modal/PreviewSection';
import ContentSection from './modal/ContentSection';
import ModalFooter from './modal/ModalFooter';
import ModalBackground from './modal/ModalBackground';

export interface CustomizationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CustomizationModal: React.FC<CustomizationModalProps> = ({ 
  open,
  onOpenChange
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSaveAnimation, setShowSaveAnimation] = useState(false);
  const { saveCustomization, resetCustomization } = useBookshelfStore();
  
  console.log("[CustomizationModal] Rendering with open prop:", open);
  console.log("[CustomizationModal] Current store state:", useBookshelfStore.getState().ui?.isCustomizationModalOpen);
  
  // Added debugging effect for dialog open state changes
  useEffect(() => {
    console.log("[CustomizationModal] Effect triggered - open state changed to:", open);
    const storeState = useBookshelfStore.getState().ui?.isCustomizationModalOpen;
    console.log("[CustomizationModal] Store state when effect runs:", storeState);
    
    if (open !== storeState) {
      console.log("[CustomizationModal] Mismatch between prop and store state!", { prop: open, store: storeState });
    }
  }, [open]);
  
  // Force a re-render when the dialog state changes
  useEffect(() => {
    console.log("[CustomizationModal] Subscribing to store changes");
    const unsubscribe = useBookshelfStore.subscribe(
      (state) => state.ui?.isCustomizationModalOpen,
      (isOpen) => {
        console.log("[CustomizationModal] Store subscription triggered, isOpen:", isOpen);
        if (isOpen !== open) {
          console.log("[CustomizationModal] Store and prop mismatch, updating via onOpenChange");
          onOpenChange(isOpen);
        }
      }
    );
    
    return () => {
      console.log("[CustomizationModal] Unsubscribing from store");
      unsubscribe();
    };
  }, [onOpenChange, open]);
  
  const handleSave = () => {
    saveCustomization();
    setShowSaveAnimation(true);
    setTimeout(() => setShowSaveAnimation(false), 2000);
    
    toast.success("Your magical bookshelf customization has been saved!", {
      icon: "💾",
      position: "bottom-center",
      duration: 3000,
      style: {
        background: "linear-gradient(to right, #614385, #516395)",
        color: "white",
        border: "1px solid rgba(255,255,255,0.1)",
      }
    });
  };

  const handleReset = () => {
    if (confirm("Are you sure you want to reset all customization settings to their magical defaults? This spell cannot be undone.")) {
      resetCustomization();
      toast.success("Your bookshelf has been restored to its original enchantment", {
        icon: "🔮",
        position: "bottom-center",
        style: {
          background: "linear-gradient(to right, #614385, #516395)",
          color: "white",
          border: "1px solid rgba(255,255,255,0.1)",
        }
      });
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Debug dialog open change handler
  const handleOpenChange = (newOpenState: boolean) => {
    console.log("[CustomizationModal] Dialog onOpenChange called with:", newOpenState);
    console.log("[CustomizationModal] Current props.open value:", open);
    console.log("[CustomizationModal] Current store state:", useBookshelfStore.getState().ui?.isCustomizationModalOpen);
    
    onOpenChange(newOpenState);
    
    // Give time for state to update, then check if it worked
    setTimeout(() => {
      console.log("[CustomizationModal] After onOpenChange, store state:", 
        useBookshelfStore.getState().ui?.isCustomizationModalOpen);
    }, 100);
  };

  return (
    <Dialog 
      open={open} 
      onOpenChange={handleOpenChange}
    >
      <DialogContent 
        className={`${isFullscreen ? 'max-w-[95vw] h-[95vh] max-h-[95vh]' : 'max-w-4xl max-h-[90vh]'} 
          transition-all duration-500 flex flex-col bg-gradient-to-b from-slate-950/95 to-slate-900/95 border-amber-950/30
          backdrop-blur-md relative overflow-hidden p-6 z-[100]`}
        style={{ 
          minWidth: isFullscreen ? '95vw' : 'auto',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.45)'
        }}
        hideCloseButton={true}
      >
        {/* Background subtle animation */}
        <ModalBackground />
        
        <div className="relative z-10 flex flex-col h-full">
          <ModalHeader 
            isFullscreen={isFullscreen} 
            toggleFullscreen={toggleFullscreen} 
          />
          
          {/* Live Preview Section */}
          <PreviewSection showSaveAnimation={showSaveAnimation} />
          
          {/* Content Section */}
          <ContentSection />
          
          {/* Footer Section */}
          <ModalFooter 
            handleSave={handleSave} 
            handleReset={handleReset} 
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CustomizationModal;
