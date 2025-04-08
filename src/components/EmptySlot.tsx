
import React, { useState } from 'react';
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
  const [isRecipeModalOpen, setIsRecipeModalOpen] = useState(false);
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

  const handleClick = () => {
    console.log("[EmptySlot] Slot clicked with type:", slotType);
    
    // For recipe slots, open the recipe modal instead of the file input
    if (slotType === 'recipe' && activeShelfId) {
      console.log("[EmptySlot] Opening recipe modal");
      setIsRecipeModalOpen(true);
    } else if (slotType === 'book' && activeShelfId) {
      // For book slots, open the book modal with null ID to create a new book
      console.log("[EmptySlot] Opening book modal for new book");
      openModal(null);
    } else {
      console.log("[EmptySlot] Triggering file input click");
      onClick();
    }
  };

  return (
    <>
      <div 
        className="empty flex items-center justify-center h-full w-full cursor-pointer rounded-sm"
        onClick={handleClick}
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
      
      {/* Recipe Modal */}
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
