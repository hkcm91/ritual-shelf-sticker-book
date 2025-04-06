
import React, { useEffect, useState } from 'react';
import { useBookshelfStore, initializeDefaultShelf } from '../store/bookshelfStore';
import BookshelfGrid from '../components/BookshelfGrid';
import BookModal from '../components/BookModal';
import { toast } from 'sonner';
import Header from '../components/layout/Header';
import ShelfDialogs from '../components/shelf/ShelfDialogs';
import BackgroundSettings from '../components/settings/BackgroundSettings';

const Index = () => {
  const { shelves, activeShelfId } = useBookshelfStore();
  const [isNewShelfModalOpen, setIsNewShelfModalOpen] = useState(false);
  const [newShelfName, setNewShelfName] = useState("");
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [renameValue, setRenameValue] = useState("");
  
  // Background customization
  const [showBgImageDialog, setShowBgImageDialog] = useState<boolean>(false);
  const [bgImage, setBgImage] = useState<string | null>(null);
  const [bgImageUrl, setBgImageUrl] = useState<string>('');
  
  // Initialize the store
  useEffect(() => {
    const shelfId = initializeDefaultShelf();
    if (shelfId) {
      toast.success('Welcome to Ritual Bookshelf!', {
        description: 'Upload book covers by clicking on the "+" slots or drag and drop images.',
      });
    }
  }, []);
  
  // Load background from localStorage
  useEffect(() => {
    try {
      const savedBgImage = localStorage.getItem('webpage-background-image');
      if (savedBgImage) {
        setBgImage(savedBgImage);
      }
    } catch (error) {
      console.error('Error loading background from localStorage:', error);
    }
  }, []);
  
  // Save background to localStorage when it changes
  useEffect(() => {
    if (bgImage) {
      try {
        localStorage.setItem('webpage-background-image', bgImage);
      } catch (error) {
        // Handle quota exceeded error
        console.error('Error saving background to localStorage:', error);
        toast.error('Background image is too large to store locally', {
          description: 'Try using a URL or a smaller image file.'
        });
      }
    } else {
      try {
        localStorage.removeItem('webpage-background-image');
      } catch (error) {
        console.error('Error removing background from localStorage:', error);
      }
    }
  }, [bgImage]);

  const currentShelf = shelves[activeShelfId];
  
  return (
    <div 
      className="min-h-screen flex flex-col"
      style={{
        backgroundImage: bgImage ? `url(${bgImage})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <Header 
        currentShelf={currentShelf}
        setIsNewShelfModalOpen={setIsNewShelfModalOpen}
        setIsRenameModalOpen={setIsRenameModalOpen}
        setRenameValue={setRenameValue}
        setShowBgImageDialog={setShowBgImageDialog}
      />
      
      <div className="flex-grow w-full overflow-auto">
        <BookshelfGrid />
      </div>
      
      <BookModal />
      
      <ShelfDialogs 
        isNewShelfModalOpen={isNewShelfModalOpen}
        setIsNewShelfModalOpen={setIsNewShelfModalOpen}
        newShelfName={newShelfName}
        setNewShelfName={setNewShelfName}
        isRenameModalOpen={isRenameModalOpen}
        setIsRenameModalOpen={setIsRenameModalOpen}
        renameValue={renameValue}
        setRenameValue={setRenameValue}
      />
      
      <BackgroundSettings 
        showBgImageDialog={showBgImageDialog}
        setShowBgImageDialog={setShowBgImageDialog}
        bgImage={bgImage}
        setBgImage={setBgImage}
        bgImageUrl={bgImageUrl}
        setBgImageUrl={setBgImageUrl}
      />
    </div>
  );
};

export default Index;
