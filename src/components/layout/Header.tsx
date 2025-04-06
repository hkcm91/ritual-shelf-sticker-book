
import React from 'react';
import { Button } from "@/components/ui/button";
import { PlusCircle, Edit2, Palette } from "lucide-react";
import ShelfSelector from './ShelfSelector';
import HeaderAuthButton from '../Header';
import ShelfControls from '../ShelfControls';
import BookSearchDrawer from '../BookSearchDrawer';

type HeaderProps = {
  currentShelf: any;
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
  return (
    <header className="bg-wood-texture bg-cover shadow-md sticky top-0 z-30 px-4 py-3">
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
            onClick={() => setShowBgImageDialog(true)}
            className="bg-white/90 hover:bg-white text-gray-700"
            title="Customize Background"
          >
            <Palette className="h-4 w-4" />
          </Button>
          <ShelfControls />
          <BookSearchDrawer />
        </div>
      </div>
    </header>
  );
};

export default Header;
