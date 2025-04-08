
import React from 'react';
import { PlusCircle, Book, Music, Utensils, BookMarked } from 'lucide-react';
import { SlotType } from '@/store/types';

interface EmptySlotProps {
  fileInputRef: React.RefObject<HTMLInputElement>;
  onFileSelect: (file: File) => void;
  slotType: SlotType;
  onClick: () => void;
  position: number;
}

const EmptySlot: React.FC<EmptySlotProps> = ({ 
  fileInputRef, 
  onFileSelect,
  slotType,
  onClick,
  position
}) => {
  const getSlotIcon = () => {
    switch (slotType) {
      case 'book':
        return <Book className="h-5 w-5" />;
      case 'music':
        return <Music className="h-5 w-5" />;
      case 'recipe':
        return <Utensils className="h-5 w-5" />;
      case 'notebook':
        return <BookMarked className="h-5 w-5" />;
      case 'sticker':
        return <PlusCircle className="h-5 w-5" />;
      default:
        return <PlusCircle className="h-5 w-5" />;
    }
  };

  return (
    <div 
      className="empty flex items-center justify-center h-full w-full cursor-pointer rounded-sm"
      onClick={onClick}
      data-position={position}
      data-slot-type={slotType}
    >
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept={slotType === 'sticker' ? "image/*, .json" : "image/*"}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            onFileSelect(file);
          }
        }}
      />
      <button 
        className="add-book-button flex items-center justify-center p-2.5 rounded-full"
        type="button"
        aria-label={`Add ${slotType}`}
      >
        {getSlotIcon()}
      </button>
    </div>
  );
};

export default EmptySlot;
