
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import { Book, PlusCircle, Settings, Trash2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBookshelfStore } from '@/store/bookshelfStore';
import { ShelfData } from '@/store/types';
import { toast } from 'sonner';
import BookshelfGrid from '@/components/bookshelf/BookshelfGrid';
import { PopupWindow } from '@/components/ui/popup-window';
import ZoomControls from '@/components/ZoomControls';

const LibraryPage: React.FC = () => {
  const { libraryId } = useParams<{ libraryId: string }>();
  const navigate = useNavigate();
  const { shelves, activeShelfId, switchShelf, deleteShelf, updateShelf } = useBookshelfStore();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false);
  const [libraryName, setLibraryName] = useState('');
  
  // Get the current library
  const shelvesData = shelves as Record<string, ShelfData>;
  const currentLibrary = libraryId ? shelvesData[libraryId] : null;
  
  // Set the active shelf to the current library
  useEffect(() => {
    if (libraryId && shelvesData[libraryId] && activeShelfId !== libraryId) {
      switchShelf(libraryId);
    } else if (!libraryId || !shelvesData[libraryId]) {
      // If library doesn't exist, redirect to widget launcher
      navigate('/widgets');
      toast.error('Library not found');
    }
  }, [libraryId, shelvesData, activeShelfId, switchShelf, navigate]);
  
  // Initialize library name state
  useEffect(() => {
    if (currentLibrary) {
      setLibraryName(currentLibrary.name);
    }
  }, [currentLibrary]);
  
  const handleDeleteLibrary = () => {
    if (libraryId) {
      deleteShelf(libraryId);
      setIsDeleteDialogOpen(false);
      navigate('/widgets');
      toast.success('Library deleted successfully');
    }
  };
  
  const handleUpdateSettings = () => {
    if (libraryId && libraryName.trim()) {
      updateShelf(libraryId, { name: libraryName });
      setIsSettingsDialogOpen(false);
      toast.success('Library settings updated');
    } else {
      toast.error('Library name cannot be empty');
    }
  };
  
  const libraryTypeIcon = () => {
    if (!currentLibrary) return <Book />;
    
    switch(currentLibrary.type) {
      case 'book': return <Book className="h-5 w-5 text-amber-300" />;
      case 'notebook': return <Book className="h-5 w-5 text-emerald-300" />;
      case 'recipe': return <Book className="h-5 w-5 text-rose-300" />;
      case 'music': return <Book className="h-5 w-5 text-purple-300" />;
      default: return <Book className="h-5 w-5 text-amber-300" />;
    }
  };
  
  return (
    <div 
      className="min-h-screen flex flex-col"
      style={{
        backgroundColor: 'var(--page-bg, #f5f5f5)',
        backgroundImage: 'var(--page-bg-image, none)',
        backgroundSize: 'var(--page-bg-size, cover)',
        backgroundRepeat: 'var(--page-bg-repeat, no-repeat)',
        backgroundPosition: 'var(--page-bg-position, center)',
        backgroundAttachment: 'var(--page-bg-attachment, fixed)',
        color: 'var(--page-text-color, #333333)'
      }}
    >
      <Header />
      
      {/* Library Header */}
      <div className="bg-gradient-to-r from-amber-900/20 to-amber-950/20 border-b border-amber-800/20 py-3 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="text-amber-200 hover:text-amber-100"
              onClick={() => navigate('/widgets')}
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              <span>Back</span>
            </Button>
            
            <h1 className="text-xl font-semibold text-amber-100 flex items-center gap-2">
              {libraryTypeIcon()}
              <span>{currentLibrary?.name || 'Library'}</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="game-btn from-amber-900/40 to-amber-950/40 text-amber-100"
              onClick={() => setIsSettingsDialogOpen(true)}
            >
              <Settings className="h-4 w-4 mr-1" />
              <span>Settings</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="game-btn from-red-900/30 to-red-950/30 text-red-200 hover:text-red-100"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              <span>Delete</span>
            </Button>
          </div>
        </div>
      </div>
      
      <div className="flex-grow w-full overflow-auto p-0">
        <BookshelfGrid />
      </div>
      
      {/* Zoom Controls */}
      <ZoomControls />
      
      {/* Delete Confirmation Dialog */}
      <PopupWindow
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        title={
          <>
            <Trash2 className="h-5 w-5 text-red-300" />
            <span>Delete Library</span>
          </>
        }
        size="sm"
        footer={
          <>
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
              className="border-amber-700/30 text-amber-200 hover:bg-amber-950/30"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleDeleteLibrary}
              className="bg-gradient-to-b from-red-700 to-red-800 text-red-100 hover:from-red-600 hover:to-red-700"
            >
              Delete Library
            </Button>
          </>
        }
      >
        <div className="space-y-4 p-2">
          <p className="text-amber-100">
            Are you sure you want to delete "{currentLibrary?.name}"? This action cannot be undone and all items in this library will be permanently removed.
          </p>
        </div>
      </PopupWindow>
      
      {/* Settings Dialog */}
      <PopupWindow
        isOpen={isSettingsDialogOpen}
        onClose={() => setIsSettingsDialogOpen(false)}
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
              onClick={() => setIsSettingsDialogOpen(false)}
              className="border-amber-700/30 text-amber-200 hover:bg-amber-950/30"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleUpdateSettings}
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
                    if (value >= 1 && value <= 5 && libraryId) {
                      updateShelf(libraryId, { rows: value });
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
                    if (value >= 1 && value <= 8 && libraryId) {
                      updateShelf(libraryId, { columns: value });
                    }
                  }}
                  className="w-full px-3 py-2 bg-amber-950/30 border border-amber-700/30 rounded-md text-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-600/50"
                />
              </div>
            </div>
          </div>
        </div>
      </PopupWindow>
    </div>
  );
};

export default LibraryPage;
