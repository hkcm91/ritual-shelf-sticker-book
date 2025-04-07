
import React from 'react';
import { Button } from "@/components/ui/button";
import { Palette } from "lucide-react";
import ShelfSelector from './ShelfSelector';
import HeaderAuthButton from '../Header';
import ShelfControls from '../ShelfControls';
import BookSearchDrawer from '../BookSearchDrawer';
import { useBookshelfStore } from '../../store/bookshelfStore';
import CustomizationModal from '../customization/CustomizationModal';
import { ShelfData } from '../../store/types';

type HeaderProps = {
  currentShelf: ShelfData | null;
  setIsNewShelfModalOpen: (open: boolean) => void;
  setIsRenameModalOpen: (open: boolean) => void;
  setRenameValue: (value: string) => void;
  setShowBgImageDialog: (show: boolean) => void;
};

const Header: React.FC<HeaderProps> = ({
  currentShelf,
  setIsNewShelfModalOpen,
  setIsRenameModalOpen,
  setRenameValue,
  setShowBgImageDialog
}) => {
  const { ui, openCustomizationModal, closeCustomizationModal } = useBookshelfStore();
  
  return (
    <header className="shadow-md sticky top-0 z-30 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <ShelfSelector 
            currentShelf={currentShelf}
            setIsRenameModalOpen={setIsRenameModalOpen}
            setRenameValue={setRenameValue}
            setIsNewShelfModalOpen={setIsNewShelfModalOpen}
          />
        </div>
        
        <div className="flex items-center space-x-3">
          <HeaderAuthButton />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => openCustomizationModal()}
            className="bg-white/90 hover:bg-white text-gray-700"
            title="Customize Appearance"
          >
            <Palette className="h-4 w-4" />
          </Button>
          <ShelfControls />
          <BookSearchDrawer />
        </div>
      </div>
      
      <CustomizationModal 
        open={ui?.isCustomizationModalOpen || false} 
        onOpenChange={(open) => {
          if (open) {
            openCustomizationModal();
          } else {
            closeCustomizationModal();
          }
        }} 
      />
    </header>
  );
};

export default Header;
