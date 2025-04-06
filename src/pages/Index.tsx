
import React, { useEffect, useState, useRef } from 'react';
import { useBookshelfStore, initializeDefaultShelf } from '../store/bookshelfStore';
import BookshelfGrid from '../components/BookshelfGrid';
import BookModal from '../components/BookModal';
import BookSearchDrawer from '../components/BookSearchDrawer';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { BookOpen, PlusCircle, Edit2, Palette } from "lucide-react";
import ShelfControls from '../components/ShelfControls';
import BgImageDialog from '../components/BgImageDialog';

const Index = () => {
  const { shelves, activeShelfId, switchShelf, addShelf, updateShelf } = useBookshelfStore();
  const [isNewShelfModalOpen, setIsNewShelfModalOpen] = React.useState(false);
  const [newShelfName, setNewShelfName] = React.useState("");
  const [isRenameModalOpen, setIsRenameModalOpen] = React.useState(false);
  const [renameValue, setRenameValue] = React.useState("");
  
  // Background customization
  const [showBgImageDialog, setShowBgImageDialog] = useState<boolean>(false);
  const [bgImage, setBgImage] = useState<string | null>(null);
  const [bgImageUrl, setBgImageUrl] = useState<string>('');
  const bgFileInputRef = useRef<HTMLInputElement>(null);
  
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
  
  const handleAddShelf = () => {
    if (newShelfName.trim()) {
      addShelf({
        name: newShelfName.trim(),
        rows: 2,
        columns: 4
      });
      setNewShelfName("");
      setIsNewShelfModalOpen(false);
    }
  };

  const handleRename = () => {
    if (renameValue.trim() && activeShelfId) {
      updateShelf(activeShelfId, { name: renameValue.trim() });
      setRenameValue("");
      setIsRenameModalOpen(false);
    }
  };
  
  const handleBgFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.type.startsWith('image/')) {
      // Check file size before processing
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        toast.warning('Image is large and may not be stored locally', {
          description: 'Consider using an image URL instead.'
        });
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        if (typeof event.target?.result === 'string') {
          try {
            setBgImage(event.target.result);
            toast.success('Background image added successfully');
            setShowBgImageDialog(false);
          } catch (error) {
            toast.error('Failed to set background image', {
              description: 'The image might be too large. Try using a URL instead.'
            });
          }
        }
      };
      reader.readAsDataURL(file);
    } else {
      toast.error('Only image files are supported for backgrounds');
    }
    
    if (bgFileInputRef.current) {
      bgFileInputRef.current.value = '';
    }
  };
  
  const handleBgImageUrlSubmit = () => {
    if (!bgImageUrl) return;
    
    // When using URL, we just store the URL reference instead of the data
    setBgImage(bgImageUrl);
    toast.success('Background image added from URL');
    setShowBgImageDialog(false);
    setBgImageUrl('');
  };

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
      <header className="bg-wood-texture bg-cover shadow-md sticky top-0 z-30 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <BookOpen className="h-5 w-5 text-white/90" />
            
            <div className="flex items-center gap-2">
              <div className="w-48">
                <Select
                  value={activeShelfId}
                  onValueChange={(value) => switchShelf(value)}
                >
                  <SelectTrigger className="bg-white/90 border-0">
                    <SelectValue placeholder="Select a shelf..." />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(shelves).map((shelf) => (
                      <SelectItem key={shelf.id} value={shelf.id}>
                        {shelf.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  if (currentShelf) {
                    setRenameValue(currentShelf.name);
                    setIsRenameModalOpen(true);
                  }
                }}
                disabled={!currentShelf}
                className="bg-white/90 hover:bg-white text-gray-700"
              >
                <Edit2 className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsNewShelfModalOpen(true)}
                className="bg-white/90 hover:bg-white text-gray-700"
              >
                <PlusCircle className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
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
      
      <div className="flex-grow w-full overflow-auto">
        <BookshelfGrid />
      </div>
      
      <BookModal />
      
      <BgImageDialog
        open={showBgImageDialog}
        onOpenChange={setShowBgImageDialog}
        bgImage={bgImage}
        bgImageUrl={bgImageUrl}
        onBgImageUrlChange={setBgImageUrl}
        onUploadClick={() => bgFileInputRef.current?.click()}
        onBgImageUrlSubmit={handleBgImageUrlSubmit}
        onBgImageRemove={() => setBgImage(null)}
      />
      
      <input
        ref={bgFileInputRef}
        type="file"
        accept="image/*"
        onChange={handleBgFileChange}
        className="hidden"
      />
    </div>
  );
};

export default Index;
