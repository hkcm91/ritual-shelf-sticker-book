
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import { useBookshelfStore } from '@/store/bookshelfStore';
import { ShelfData } from '@/store/types';
import { toast } from 'sonner';
import BookshelfGrid from '@/components/bookshelf/BookshelfGrid';
import ZoomControls from '@/components/ZoomControls';
import { LibraryHeader, LibraryDeleteDialog, LibrarySettingsDialog } from '@/components/library';

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
      
      {currentLibrary && (
        <div className="flex items-center justify-between px-4 py-2">
          <LibraryHeader 
            currentLibrary={currentLibrary}
            onSettingsOpen={() => setIsSettingsDialogOpen(true)}
            onDeleteOpen={() => setIsDeleteDialogOpen(true)}
          />
        </div>
      )}
      
      <div className="flex-grow w-full overflow-auto p-0">
        <BookshelfGrid />
      </div>
      
      {/* Zoom Controls */}
      <ZoomControls />
      
      {/* Delete Confirmation Dialog */}
      <LibraryDeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        currentLibrary={currentLibrary}
        onDelete={handleDeleteLibrary}
      />
      
      {/* Settings Dialog */}
      <LibrarySettingsDialog
        isOpen={isSettingsDialogOpen}
        onClose={() => setIsSettingsDialogOpen(false)}
        currentLibrary={currentLibrary}
        libraryName={libraryName}
        setLibraryName={setLibraryName}
        onSave={handleUpdateSettings}
        onRowsChange={handleRowsChange}
        onColumnsChange={handleColumnsChange}
      />
    </div>
  );
};

export default LibraryPage;
