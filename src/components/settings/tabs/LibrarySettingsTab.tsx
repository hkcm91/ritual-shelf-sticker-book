
import React, { useState, useEffect } from 'react';
import { Settings, Lightbulb, Rows3, Columns3, Trash2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from "@/components/ui/card";
import { ShelfData } from '@/store/types';
import { useBookshelfStore } from '@/store/bookshelfStore';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface LibrarySettingsTabProps {
  currentLibrary: ShelfData | null;
  libraryId: string;
  onCloseDrawer: () => void;
}

const LibrarySettingsTab: React.FC<LibrarySettingsTabProps> = ({
  currentLibrary,
  libraryId,
  onCloseDrawer
}) => {
  const { updateShelf, deleteShelf } = useBookshelfStore();
  const navigate = useNavigate();
  const [libraryName, setLibraryName] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  useEffect(() => {
    if (currentLibrary) {
      setLibraryName(currentLibrary.name);
    }
  }, [currentLibrary]);
  
  const handleUpdateSettings = () => {
    if (libraryId && libraryName.trim()) {
      updateShelf(libraryId, { name: libraryName });
      toast.success('Library settings updated');
    } else {
      toast.error('Library name cannot be empty');
    }
  };
  
  const handleDeleteLibrary = () => {
    if (libraryId) {
      deleteShelf(libraryId);
      setIsDeleteDialogOpen(false);
      onCloseDrawer();
      navigate('/widgets');
      toast.success('Library deleted successfully');
    }
  };
  
  const handleRowsChange = (rows: number) => {
    if (libraryId) {
      updateShelf(libraryId, { rows });
    }
  };
  
  const handleColumnsChange = (columns: number) => {
    if (libraryId) {
      updateShelf(libraryId, { columns });
    }
  };

  const getThemeColors = () => {
    if (!currentLibrary) return 'text-purple-300';
    
    switch(currentLibrary.type) {
      case 'book': return 'text-amber-300';
      case 'notebook': return 'text-emerald-300';
      case 'recipe': return 'text-rose-300';
      case 'music': return 'text-purple-300';
      default: return 'text-amber-300';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6 space-y-6">
          <div className="popup-section bg-amber-950/20 p-5 rounded-lg border border-amber-800/30">
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
                  className="w-full px-4 py-2.5 bg-amber-950/30 border border-amber-700/30 rounded-md text-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-600/50 transition-all duration-300"
                  placeholder="Enter a name for your library"
                />
              </div>
              <Button 
                onClick={handleUpdateSettings}
                className="w-full bg-gradient-to-b from-amber-600 to-amber-800 text-white hover:brightness-110 transition-all duration-300"
              >
                Save Library Name
              </Button>
            </div>
          </div>
          
          <div className="popup-section bg-amber-950/20 p-5 rounded-lg border border-amber-800/30">
            <h3 className="popup-section-title text-lg font-semibold mb-3 flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${getThemeColors()} inline-block`}></span>
              Display Options
            </h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="flex flex-col">
                <label htmlFor="rows" className="flex items-center gap-2 text-sm font-medium text-amber-200 mb-2">
                  <Rows3 className="h-4 w-4" /> Rows
                </label>
                <div className="flex rounded-md overflow-hidden border border-amber-700/30">
                  <button 
                    className="px-3.5 py-2.5 bg-amber-900/40 text-amber-100 hover:bg-amber-800/40 transition-colors"
                    onClick={() => {
                      const currentRows = currentLibrary?.rows || 2;
                      if (currentRows > 1) {
                        handleRowsChange(currentRows - 1);
                      }
                    }}
                  >
                    −
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
                        handleRowsChange(value);
                      }
                    }}
                    className="w-full px-3 py-2.5 bg-amber-950/30 text-center text-amber-100 focus:outline-none focus:ring-1 focus:ring-amber-600/50"
                  />
                  <button 
                    className="px-3.5 py-2.5 bg-amber-900/40 text-amber-100 hover:bg-amber-800/40 transition-colors"
                    onClick={() => {
                      const currentRows = currentLibrary?.rows || 2;
                      if (currentRows < 5) {
                        handleRowsChange(currentRows + 1);
                      }
                    }}
                  >
                    +
                  </button>
                </div>
              </div>
              
              <div className="flex flex-col">
                <label htmlFor="columns" className="flex items-center gap-2 text-sm font-medium text-amber-200 mb-2">
                  <Columns3 className="h-4 w-4" /> Columns
                </label>
                <div className="flex rounded-md overflow-hidden border border-amber-700/30">
                  <button 
                    className="px-3.5 py-2.5 bg-amber-900/40 text-amber-100 hover:bg-amber-800/40 transition-colors"
                    onClick={() => {
                      const currentColumns = currentLibrary?.columns || 4;
                      if (currentColumns > 1) {
                        handleColumnsChange(currentColumns - 1);
                      }
                    }}
                  >
                    −
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
                        handleColumnsChange(value);
                      }
                    }}
                    className="w-full px-3 py-2.5 bg-amber-950/30 text-center text-amber-100 focus:outline-none focus:ring-1 focus:ring-amber-600/50"
                  />
                  <button 
                    className="px-3.5 py-2.5 bg-amber-900/40 text-amber-100 hover:bg-amber-800/40 transition-colors"
                    onClick={() => {
                      const currentColumns = currentLibrary?.columns || 4;
                      if (currentColumns < 8) {
                        handleColumnsChange(currentColumns + 1);
                      }
                    }}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
            
            <div className="mt-5 p-3 bg-amber-900/20 rounded-lg border border-amber-800/20 flex items-start gap-3">
              <Lightbulb className="h-5 w-5 text-amber-300 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-200/80">
                Adjust rows and columns to customize the size of your bookshelf. More rows give you vertical space,
                while more columns expand horizontally. Find the perfect balance for your collection!
              </p>
            </div>
          </div>
          
          <div className="popup-section bg-red-950/20 p-5 rounded-lg border border-red-800/30">
            <h3 className="popup-section-title text-lg font-semibold mb-3 flex items-center gap-2 text-red-300">
              <span className="h-2 w-2 rounded-full bg-red-500 inline-block"></span>
              Danger Zone
            </h3>

            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="outline" 
                  className="w-full border-red-800/30 bg-red-950/30 text-red-300 hover:bg-red-900/40 hover:text-red-200"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete this library
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-[#1A1F2C] border border-amber-700/30">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-red-300 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Delete Library
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-amber-100">
                    Are you sure you want to delete <span className="font-bold">"{currentLibrary?.name}"</span>?
                    <p className="text-red-300 mt-2">
                      This action cannot be undone and all items in this library will be permanently removed.
                    </p>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="border-amber-700/30 text-amber-200 hover:bg-amber-950/30">Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    className="bg-gradient-to-b from-red-500 to-red-700 text-white hover:from-red-400 hover:to-red-600"
                    onClick={handleDeleteLibrary}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LibrarySettingsTab;
