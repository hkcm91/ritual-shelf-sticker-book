
import React, { useState } from 'react';
import { storageService } from '../services/storageService';
import { toast } from 'sonner';
import UrlDialog from './UrlDialog';
import { useBookshelfStore } from '../store/bookshelfStore';

type EmptySlotProps = {
  fileInputRef: React.RefObject<HTMLInputElement>;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  slotType?: "book" | "sticker";
  onClick?: () => void; 
  position: number; // Add position prop to know which slot we're working with
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
  const { addBook, openModal, activeShelfId } = useBookshelfStore();
  
  // Set accept attribute based on slot type
  const acceptAttr = slotType === "book" 
    ? "image/*" 
    : "image/*,application/json";
  
  // Check storage before upload
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const stats = storageService.getUsageStats();
    
    // If storage is getting full (over 80%), warn the user
    if (stats.percent > 80) {
      toast.warning(`Storage is ${stats.percent}% full. Consider removing unused items or using smaller images.`);
    }
    
    // For book slots, create a temporary book and open the modal
    if (slotType === "book" && e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      if (!file.type.startsWith('image/')) {
        toast.error('Only image files are supported for books');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = async (event) => {
        if (typeof event.target?.result === 'string') {
          try {
            // Create a temporary book and open the modal for editing
            const newBookId = addBook({
              title: '',
              author: '',
              coverURL: event.target.result,
              progress: 0,
              rating: 0,
              position,
              shelfId: activeShelfId,
              isSticker: false
            });
            
            if (newBookId) {
              // Open modal for book editing immediately
              openModal(newBookId);
            } else {
              toast.error('Failed to add book');
            }
          } catch (error) {
            console.error('Error adding book:', error);
            toast.error('Failed to save to localStorage. Try using smaller images or clearing some space.');
          }
        }
      };
      reader.readAsDataURL(file);
    } else {
      // Continue with normal file selection for stickers
      onFileSelect(e);
    }
  };
  
  // Handle the click event and call the onClick prop
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling
    
    if (slotType === "sticker") {
      // For stickers, show the URL dialog
      setShowUrlDialog(true);
    } else {
      // For books, trigger the file input click
      if (onClick) {
        onClick();
      }
    }
  };
  
  const handleUrlSubmit = () => {
    // Here you would handle adding a sticker from URL
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
        className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer"
        onClick={handleClick}
      >
        <span className="text-5xl text-gray-300/20">+</span>
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
