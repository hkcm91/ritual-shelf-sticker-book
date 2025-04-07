
import React from 'react';
import SettingsDrawer from './settings/SettingsDrawer';
import { Palette } from 'lucide-react';
import { Button } from './ui/button';
import { useBookshelfStore } from '@/store/bookshelfStore';

const ShelfControls: React.FC = () => {
  const { openCustomizationModal, ui } = useBookshelfStore();
  
  const handleOpenCustomization = () => {
    console.log("ShelfControls: Opening customization modal button clicked");
    console.log("Current modal state before opening:", ui?.isCustomizationModalOpen);
    openCustomizationModal();
    console.log("Modal state after calling openCustomizationModal:", useBookshelfStore.getState().ui?.isCustomizationModalOpen);
  };
  
  return (
    <div className="flex items-center gap-2">
      <SettingsDrawer />
      <Button 
        variant="ghost" 
        size="icon" 
        className="bg-white/90 hover:bg-white text-gray-700"
        onClick={handleOpenCustomization}
      >
        <Palette className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ShelfControls;
