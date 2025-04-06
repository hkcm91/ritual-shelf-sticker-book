
import React from 'react';
import { storageService } from '../services/storageService';
import { toast } from 'sonner';

type EmptySlotProps = {
  fileInputRef: React.RefObject<HTMLInputElement>;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  slotType?: "book" | "sticker";
  onClick?: () => void; // Changed from React.MouseEvent to no parameters
};

const EmptySlot: React.FC<EmptySlotProps> = ({ 
  fileInputRef, 
  onFileSelect, 
  slotType = "book",
  onClick 
}) => {
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
    if (onClick) {
      onClick(); // Call the onClick prop without passing the event
    }
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
    </>
  );
};

export default EmptySlot;
