
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
  const getThemeColors = () => {
    if (!currentLibrary) return 'text-amber-300';
    
    switch(currentLibrary.type) {
      case 'book': return 'text-amber-300';
      case 'notebook': return 'text-emerald-300';
      case 'recipe': return 'text-rose-300';
      case 'music': return 'text-purple-300';
      default: return 'text-amber-300';
    }
  };

  return (
    <PopupWindow
      isOpen={isOpen}
      onClose={onClose}
      title={
        <>
          <Settings className={`h-5 w-5 ${getThemeColors()}`} />
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
            className="bg-gradient-to-b from-amber-600 to-amber-800 text-white hover:from-amber-500 hover:to-amber-700 transition-all duration-300 hover:shadow-lg"
          >
            Save Changes
          </Button>
        </>
      }
    >
      <div className="space-y-6 p-2">
        <div className="popup-section bg-amber-950/20 p-4 rounded-lg border border-amber-800/30">
          <h3 className="popup-section-title text-lg font-semibold mb-3 flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${getThemeColors()} inline-block`}></span>
            Basic Details
          </h3>
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
                className="w-full px-4 py-2 bg-amber-950/30 border border-amber-700/30 rounded-md text-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-600/50 transition-all duration-300"
              />
            </div>
          </div>
        </div>
        
        <div className="popup-section bg-amber-950/20 p-4 rounded-lg border border-amber-800/30">
          <h3 className="popup-section-title text-lg font-semibold mb-3 flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${getThemeColors()} inline-block`}></span>
            Display Options
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="rows" className="block text-sm font-medium text-amber-200 mb-1">
                Rows
              </label>
              <div className="flex rounded-md overflow-hidden border border-amber-700/30">
                <button 
                  className="px-3 py-2 bg-amber-900/40 text-amber-100 hover:bg-amber-800/40 transition-colors"
                  onClick={() => {
                    const currentRows = currentLibrary?.rows || 2;
                    if (currentRows > 1) {
                      onRowsChange(currentRows - 1);
                    }
                  }}
                >
                  -
                </button>
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
                  className="w-full px-3 py-2 bg-amber-950/30 text-center text-amber-100 focus:outline-none focus:ring-1 focus:ring-amber-600/50"
                />
                <button 
                  className="px-3 py-2 bg-amber-900/40 text-amber-100 hover:bg-amber-800/40 transition-colors"
                  onClick={() => {
                    const currentRows = currentLibrary?.rows || 2;
                    if (currentRows < 5) {
                      onRowsChange(currentRows + 1);
                    }
                  }}
                >
                  +
                </button>
              </div>
            </div>
            
            <div>
              <label htmlFor="columns" className="block text-sm font-medium text-amber-200 mb-1">
                Columns
              </label>
              <div className="flex rounded-md overflow-hidden border border-amber-700/30">
                <button 
                  className="px-3 py-2 bg-amber-900/40 text-amber-100 hover:bg-amber-800/40 transition-colors"
                  onClick={() => {
                    const currentColumns = currentLibrary?.columns || 4;
                    if (currentColumns > 1) {
                      onColumnsChange(currentColumns - 1);
                    }
                  }}
                >
                  -
                </button>
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
                  className="w-full px-3 py-2 bg-amber-950/30 text-center text-amber-100 focus:outline-none focus:ring-1 focus:ring-amber-600/50"
                />
                <button 
                  className="px-3 py-2 bg-amber-900/40 text-amber-100 hover:bg-amber-800/40 transition-colors"
                  onClick={() => {
                    const currentColumns = currentLibrary?.columns || 4;
                    if (currentColumns < 8) {
                      onColumnsChange(currentColumns + 1);
                    }
                  }}
                >
                  +
                </button>
              </div>
            </div>
          </div>
          <p className="text-xs text-amber-300/70 mt-3">
            ✨ Tip: Adjust rows and columns to customize the size of your bookshelf. More slots means more space for your collection!
          </p>
        </div>
      </div>
    </PopupWindow>
  );
};
