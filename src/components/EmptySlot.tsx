
import React from 'react';

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
  
  return (
    <>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-5xl text-gray-300/20">+</span>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptAttr}
        className="hidden"
        onChange={onFileSelect}
      />
    </>
  );
};

export default EmptySlot;
