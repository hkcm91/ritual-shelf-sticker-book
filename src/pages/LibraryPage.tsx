
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import { useBookshelfStore } from '@/store/bookshelfStore';
import { ShelfData } from '@/store/types';
import { toast } from 'sonner';
import BookshelfGrid from '@/components/bookshelf/BookshelfGrid';
import ZoomControls from '@/components/ZoomControls';
import { LibraryHeader } from '@/components/library';
import BookModal from '@/components/BookModal';

const LibraryPage: React.FC = () => {
  const { libraryId } = useParams<{ libraryId: string }>();
  const navigate = useNavigate();
  const { shelves, activeShelfId, switchShelf } = useBookshelfStore();
  
  const shelvesData = shelves as Record<string, ShelfData>;
  const currentLibrary = libraryId ? shelvesData[libraryId] : null;
  
  useEffect(() => {
    if (libraryId && shelvesData[libraryId] && activeShelfId !== libraryId) {
      switchShelf(libraryId);
    } else if (!libraryId || !shelvesData[libraryId]) {
      navigate('/widgets');
      toast.error('Library not found');
    }
  }, [libraryId, shelvesData, activeShelfId, switchShelf, navigate]);
  
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
      <Header>
        {currentLibrary && (
          <LibraryHeader 
            currentLibrary={currentLibrary}
          />
        )}
      </Header>
      
      <div className="flex-grow w-full overflow-auto p-0">
        <BookshelfGrid />
      </div>
      
      <ZoomControls />
      
      {/* Add BookModal component */}
      <BookModal />
    </div>
  );
};

export default LibraryPage;
