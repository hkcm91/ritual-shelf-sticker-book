
import React from 'react';
import { PlusCircle, Book, Music, Utensils, BookMarked } from 'lucide-react';
import { SlotType } from '@/store/types';
import RecipeModal from './recipe/RecipeModal';
import { useBookshelfStore } from '@/store/bookshelfStore';

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
  const [isRecipeModalOpen, setIsRecipeModalOpen] = React.useState(false);
  const { activeShelfId, openModal } = useBookshelfStore();
  
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

  const handleSlotClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("[EmptySlot] Slot clicked with type:", slotType);
    
    // Create a 50ms delay to avoid issues with event propagation
    setTimeout(() => {
      if (slotType === 'recipe' && activeShelfId) {
        console.log("[EmptySlot] Opening recipe modal");
        setIsRecipeModalOpen(true);
      } else if (slotType === 'book' && activeShelfId) {
        console.log("[EmptySlot] Opening book modal for new book");
        openModal(null);
      } else {
        console.log("[EmptySlot] Triggering file input");
        onClick();
      }
    }, 50);
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("[EmptySlot] File dropped");
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      console.log("[EmptySlot] Processing dropped file:", file.name);
      onFileSelect(file);
    }
  };

  return (
    <>
      <div 
        className="empty flex items-center justify-center h-full w-full cursor-pointer rounded-sm"
        onClick={handleSlotClick}
        onDrop={handleFileDrop}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
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
              console.log("[EmptySlot] File selected from input:", file.name);
              onFileSelect(file);
            }
          }}
        />
        <button 
          className="add-book-button flex items-center justify-center p-2.5 rounded-full bg-gray-100 hover:bg-gray-200"
          type="button"
          aria-label={`Add ${slotType}`}
        >
          {getSlotIcon()}
        </button>
      </div>
      
      {activeShelfId && (
        <RecipeModal
          isOpen={isRecipeModalOpen}
          onClose={() => setIsRecipeModalOpen(false)}
          position={position}
          shelfId={activeShelfId}
        />
      )}
    </>
  );
};

export default EmptySlot;
