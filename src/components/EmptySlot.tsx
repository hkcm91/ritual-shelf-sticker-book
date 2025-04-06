
import React, { useState } from 'react';
import { storageService } from '../services/storageService';
import { toast } from 'sonner';
import UrlDialog from './UrlDialog';

type EmptySlotProps = {
  fileInputRef: React.RefObject<HTMLInputElement>;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  slotType?: "book" | "sticker";
  onClick?: () => void; 
};

const EmptySlot: React.FC<EmptySlotProps> = ({ 
  fileInputRef, 
  onFileSelect, 
  slotType = "book",
  onClick 
}) => {
  const [showUrlDialog, setShowUrlDialog] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  
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
    
    // Continue with normal file selection
    onFileSelect(e);
  };
  
  // Handle the click event and call the onClick prop
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling
    
    if (slotType === "sticker") {
      // For stickers, show the URL dialog
      setShowUrlDialog(true);
    } else {
      // For books, use the default click handler
      if (onClick) {
        onClick();
      }
    }
  };
  
  const handleUrlSubmit = () => {
    // Here you would handle adding a sticker from URL
    // This would typically call a function from your store or service
    if (!imageUrl) {
      toast.error("Please enter a valid URL");
      return;
    }
    
    toast.success("Adding sticker from URL...");
    // Mock implementation - you'd replace this with actual code to add the sticker
    // For example: addStickerFromUrl(imageUrl, position);
    
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
