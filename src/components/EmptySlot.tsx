
import React, { useEffect, useRef } from 'react';
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
  const slotRef = useRef<HTMLDivElement>(null);
  
  // Log when this component renders
  useEffect(() => {
    console.log(`[EmptySlot] Rendering empty slot at position ${position} with type ${slotType}`);
    
    return () => {
      console.log(`[EmptySlot] Unmounting empty slot at position ${position}`);
    };
  }, [position, slotType]);
  
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
    console.log(`[EmptySlot] Slot clicked with type: ${slotType} at position ${position}`);
    
    if (slotType === 'recipe' && activeShelfId) {
      console.log(`[EmptySlot] Opening recipe modal for position ${position}`);
      setIsRecipeModalOpen(true);
    } else if (slotType === 'book' && activeShelfId) {
      console.log(`[EmptySlot] Opening book modal for new book at position ${position}`);
      openModal(null);
    } else {
      console.log(`[EmptySlot] Triggering file input for ${slotType} at position ${position}`);
      onClick();
    }
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log(`[EmptySlot] File dropped for ${slotType} at position ${position}`);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      console.log(`[EmptySlot] Processing dropped file: ${file.name}, type: ${file.type}, size: ${file.size}`);
      
      // Validate file type based on slot type
      const isImage = file.type.startsWith('image/');
      const isJson = file.type === 'application/json' || file.name.endsWith('.json');
      
      if (slotType === 'sticker' && !isImage && !isJson) {
        console.error(`[EmptySlot] Invalid file type for sticker: ${file.type}`);
        return;
      } else if (slotType !== 'sticker' && !isImage) {
        console.error(`[EmptySlot] Invalid file type for ${slotType}: ${file.type}`);
        return;
      }
      
      onFileSelect(file);
    }
  };

  // Determine the correct accept attribute based on slot type
  const getAcceptAttribute = () => {
    if (slotType === 'sticker') return "image/*, .json";
    return "image/*";
  };

  return (
    <>
      <div 
        ref={slotRef}
        className={`empty flex items-center justify-center h-full w-full cursor-pointer rounded-sm empty-slot-${slotType}`}
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
          accept={getAcceptAttribute()}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              console.log(`[EmptySlot] File selected from input for ${slotType} at position ${position}:`, file.name);
              onFileSelect(file);
            } else {
              console.log(`[EmptySlot] File selection cancelled or no file selected`);
            }
          }}
        />
        <button 
          className={`add-book-button flex items-center justify-center p-2.5 rounded-full bg-gray-100 hover:bg-gray-200 add-button-${slotType}`}
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
