
import React, { useState } from 'react';
import { storageService } from '../services/storage/storageService';
import { toast } from 'sonner';
import UrlDialog from './UrlDialog';
import { useBookshelfStore } from '../store/bookshelfStore';
import { Plus } from 'lucide-react';

type EmptySlotProps = {
  fileInputRef: React.RefObject<HTMLInputElement>;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  slotType?: "book" | "sticker";
  onClick?: () => void; 
  position: number;
};

const EmptySlot: React.FC<EmptySlotProps> = ({ 
  fileInputRef, 
  onFileSelect, 
  slotType = "book",
  onClick,
  position
}) => {
  const [showUrlDialog, setShowUrlDialog] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const { addBook, openModal, activeShelfId, slots } = useBookshelfStore();
  
  // Set accept attribute based on slot type
  const acceptAttr = slotType === "book" 
    ? "image/*" 
    : "image/*,application/json";
  
  // Handle click on empty slot
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling
    
    if (slotType === "book") {
      // For book slots, open the modal directly
      const newBookId = addBook({
        title: '',
        author: '',
        coverURL: '', // Empty cover to be updated later
        progress: 0,
        rating: 0,
        position,
        shelfId: activeShelfId,
        isSticker: false
      });
      
      if (newBookId) {
        openModal(newBookId);
      } else {
        toast.error('Failed to create new book');
      }
    } else {
      // For stickers, show the URL dialog or file picker
      if (e.altKey || e.ctrlKey) {
        // Alt or Ctrl click shows the URL dialog
        setShowUrlDialog(true);
      } else {
        // Regular click opens file picker
        fileInputRef.current?.click();
      }
    }
  };
  
  // Handle the file input change
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const stats = storageService.getUsageStats();
    
    // If storage is getting full (over 80%), warn the user
    if (stats.percent > 80) {
      toast.warning(`Storage is ${stats.percent}% full. Consider removing unused items.`);
    }
    
    onFileSelect(e);
  };
  
  // Handle URL submission for stickers
  const handleUrlSubmit = () => {
    if (!imageUrl) {
      toast.error("Please enter a valid URL");
      return;
    }
    
    try {
      // For image URLs, add as sticker
      const newBookId = addBook({
        title: 'URL Sticker',
        author: 'Sticker',
        coverURL: imageUrl,
        progress: 0,
        rating: 0,
        position,
        shelfId: activeShelfId,
        isSticker: true
      });
      
      if (newBookId) {
        toast.success("Sticker added successfully");
      } else {
        toast.error("Failed to add sticker");
      }
    } catch (error) {
      console.error('Error adding sticker from URL:', error);
      toast.error('Failed to add sticker from URL');
    }
    
    // Reset and close dialog
    setImageUrl('');
    setShowUrlDialog(false);
  };
  
  return (
    <>
      <div 
        className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer transition-colors"
        onClick={handleClick}
        style={{
          background: `transparent`,
          ":hover": {
            background: slots.emptyHoverBg
          }
        }}
      >
        <Plus 
          className="w-6 h-6" 
          style={{ color: slots.addButtonColor }}
        />
        <span 
          className="text-xs mt-1"
          style={{ color: slots.addButtonColor }}
        >
          {slotType === "book" ? "Add Book" : "Add Sticker"}
        </span>
        
        {slotType === "sticker" && (
          <span 
            className="text-xs mt-1 opacity-70"
            style={{ color: slots.addButtonColor }}
          >
            (Alt+Click for URL)
          </span>
        )}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptAttr}
        className="hidden"
        onChange={handleFileInput}
      />
      
      {/* URL Dialog for Stickers */}
      <UrlDialog 
        open={showUrlDialog}
        onOpenChange={setShowUrlDialog}
        imageUrl={imageUrl}
        onImageUrlChange={setImageUrl}
        onSubmit={handleUrlSubmit}
      />
    </>
  );
};

export default EmptySlot;
