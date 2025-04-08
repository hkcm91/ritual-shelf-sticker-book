
import React from 'react';
import { BookPlus, StickerIcon, Utensils } from 'lucide-react';

interface EmptySlotProps {
  fileInputRef: React.RefObject<HTMLInputElement>;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  slotType: "book" | "sticker" | "recipe";
  onClick?: () => void;
  position?: number;
}

const EmptySlot: React.FC<EmptySlotProps> = ({ 
  fileInputRef, 
  onFileSelect, 
  slotType, 
  onClick,
  position
}) => {
  const getIcon = () => {
    switch (slotType) {
      case "book":
        return <BookPlus className="h-8 w-8 opacity-40 text-amber-300" />;
      case "sticker":
        return <StickerIcon className="h-8 w-8 opacity-40 text-amber-300" />;
      case "recipe":
        return <Utensils className="h-8 w-8 opacity-40 text-amber-300" />;
      default:
        return <BookPlus className="h-8 w-8 opacity-40 text-amber-300" />;
    }
  };
  
  return (
    <div 
      className="empty-slot flex flex-col items-center justify-center w-full h-full text-center cursor-pointer opacity-60 hover:opacity-100 transition-opacity duration-300"
      onClick={onClick}
      data-position={position}
    >
      <div className="bg-amber-500/10 hover:bg-amber-500/20 rounded-full p-3 transition-colors duration-300">
        {getIcon()}
      </div>
      <p className="mt-3 text-xs text-amber-200">
        {slotType === "book" ? "Add Book" : slotType === "recipe" ? "Add Recipe" : "Add Sticker"}
      </p>
      <input
        type="file"
        ref={fileInputRef}
        onChange={onFileSelect}
        accept="image/*"
        className="hidden"
        data-slot-position={position}
      />
    </div>
  );
};

export default EmptySlot;
