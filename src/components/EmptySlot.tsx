
import React from 'react';
import { storageService } from '../services/storageService';
import { toast } from 'sonner';

type EmptySlotProps = {
  fileInputRef: React.RefObject<HTMLInputElement>;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  slotType?: "book" | "sticker";
};

const EmptySlot: React.FC<EmptySlotProps> = ({ fileInputRef, onFileSelect, slotType = "book" }) => {
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
  
  return (
    <>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-5xl text-gray-300/20">+</span>
        <span className="text-xs text-gray-400 mt-2">
          {slotType === "book" ? "Add Book" : "Add Sticker"}
        </span>
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
