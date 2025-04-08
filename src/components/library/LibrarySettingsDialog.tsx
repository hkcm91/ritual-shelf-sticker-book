
import React from 'react';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PopupWindow } from '@/components/ui/popup-window';
import { ShelfData } from '@/store/types';
import LibraryNameSection from './settings/LibraryNameSection';
import DisplayOptionsSection from './settings/DisplayOptionsSection';
import { getThemeColors, getButtonGradient } from './settings/ThemedUtils';

interface LibrarySettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  currentLibrary: ShelfData | null;
  libraryName: string;
  setLibraryName: (name: string) => void;
  onSave: () => void;
  onRowsChange: (rows: number) => void;
  onColumnsChange: (columns: number) => void;
}

export const LibrarySettingsDialog: React.FC<LibrarySettingsDialogProps> = ({
  isOpen,
  onClose,
  currentLibrary,
  libraryName,
  setLibraryName,
  onSave,
  onRowsChange,
  onColumnsChange
}) => {
  const themeColors = getThemeColors(currentLibrary);
  const buttonGradient = getButtonGradient(currentLibrary);

  return (
    <PopupWindow
      isOpen={isOpen}
      onClose={onClose}
      title={
        <>
          <Settings className={`h-5 w-5 ${themeColors}`} />
          <span>Library Settings</span>
        </>
      }
      size="md"
      footer={
        <>
          <Button 
            variant="outline" 
            onClick={onClose}
            className="border-amber-700/30 text-amber-200 hover:bg-amber-950/30 transition-all duration-300"
          >
            Cancel
          </Button>
          <Button 
            onClick={onSave}
            className={`bg-gradient-to-b ${buttonGradient} text-white hover:brightness-110 transition-all duration-300 hover:shadow-lg`}
          >
            Save Changes
          </Button>
        </>
      }
    >
      <div className="space-y-6 p-4">
        <LibraryNameSection 
          libraryName={libraryName}
          setLibraryName={setLibraryName}
          getThemeColors={() => themeColors}
        />
        
        <DisplayOptionsSection 
          currentLibrary={currentLibrary}
          onRowsChange={onRowsChange}
          onColumnsChange={onColumnsChange}
          getThemeColors={() => themeColors}
        />
      </div>
    </PopupWindow>
  );
};
