
import React from 'react';
import SettingsDrawer from './settings/SettingsDrawer';
import { Palette } from 'lucide-react';
import { Button } from './ui/button';
import { useBookshelfStore } from '@/store/bookshelfStore';
import { toast } from 'sonner';

const ShelfControls: React.FC = () => {
  const { openCustomizationModal } = useBookshelfStore();
  
  const handleOpenCustomization = (e: React.MouseEvent) => {
    // Ensure we have a proper event handling
    e.preventDefault();
    
    console.log("[ShelfControls] Opening customization modal button clicked");
    openCustomizationModal();
    toast.success("Opening customization panel");
    
    // Force a global event to ensure other components react to this change
    window.dispatchEvent(new CustomEvent('open-customization'));
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
