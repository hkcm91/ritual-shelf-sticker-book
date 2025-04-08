
import React from 'react';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PopupWindow } from '@/components/ui/popup-window';
import { ShelfData } from '@/store/types';

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
  return (
    <PopupWindow
      isOpen={isOpen}
      onClose={onClose}
      title={
        <>
          <Settings className="h-5 w-5 text-amber-300" />
          <span>Library Settings</span>
        </>
      }
      size="md"
      footer={
        <>
          <Button 
            variant="outline" 
            onClick={onClose}
            className="border-amber-700/30 text-amber-200 hover:bg-amber-950/30"
          >
            Cancel
          </Button>
          <Button 
            onClick={onSave}
            className="bg-gradient-to-b from-amber-700 to-amber-800 text-amber-100 hover:from-amber-600 hover:to-amber-700"
          >
            Save Changes
          </Button>
        </>
      }
    >
      <div className="space-y-6">
        <div className="popup-section">
          <h3 className="popup-section-title">Basic Details</h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="library-name" className="block text-sm font-medium text-amber-200 mb-1">
                Library Name
              </label>
              <input
                type="text"
                id="library-name"
                value={libraryName}
                onChange={(e) => setLibraryName(e.target.value)}
                className="w-full px-3 py-2 bg-amber-950/30 border border-amber-700/30 rounded-md text-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-600/50"
              />
            </div>
          </div>
        </div>
        
        <div className="popup-section">
          <h3 className="popup-section-title">Display Options</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="rows" className="block text-sm font-medium text-amber-200 mb-1">
                Rows
              </label>
              <input
                type="number"
                id="rows"
                min={1}
                max={5}
                value={currentLibrary?.rows || 2}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  if (value >= 1 && value <= 5) {
                    onRowsChange(value);
                  }
                }}
                className="w-full px-3 py-2 bg-amber-950/30 border border-amber-700/30 rounded-md text-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-600/50"
              />
            </div>
            
            <div>
              <label htmlFor="columns" className="block text-sm font-medium text-amber-200 mb-1">
                Columns
              </label>
              <input
                type="number"
                id="columns"
                min={1}
                max={8}
                value={currentLibrary?.columns || 4}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  if (value >= 1 && value <= 8) {
                    onColumnsChange(value);
                  }
                }}
                className="w-full px-3 py-2 bg-amber-950/30 border border-amber-700/30 rounded-md text-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-600/50"
              />
            </div>
          </div>
        </div>
      </div>
    </PopupWindow>
  );
};
