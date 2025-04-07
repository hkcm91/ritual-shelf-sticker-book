
import React from 'react';
import SettingsDrawer from './settings/SettingsDrawer';
import { Palette } from 'lucide-react';
import { Button } from './ui/button';
import { useBookshelfStore } from '@/store/bookshelfStore';
import { toast } from 'sonner';

const ShelfControls: React.FC = () => {
  const { openCustomizationModal, ui } = useBookshelfStore();
  
  console.log("[ShelfControls] Rendered with customization state:", ui?.isCustomizationModalOpen);
  
  const handleOpenCustomization = () => {
    console.log("[ShelfControls] Opening customization modal button clicked");
    console.log("[ShelfControls] Before opening, customization modal state:", ui?.isCustomizationModalOpen);
    
    try {
      openCustomizationModal();
      console.log("[ShelfControls] After calling openCustomizationModal, state:", useBookshelfStore.getState().ui?.isCustomizationModalOpen);
      
      // Add toast for visual feedback
      toast.success("Opening customization panel...");
    } catch (error) {
      console.error("[ShelfControls] Error opening modal:", error);
      toast.error("Failed to open customization");
    }
  };
  
  return (
    <div className="flex items-center gap-2">
      <SettingsDrawer />
      <Button 
        variant="ghost" 
        size="icon" 
        className="bg-white/90 hover:bg-white text-gray-700 z-10"
        onClick={handleOpenCustomization}
        aria-label="Open customization panel"
      >
        <Palette className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ShelfControls;
