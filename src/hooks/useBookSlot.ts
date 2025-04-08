
import { useState, useCallback } from 'react';
import { useBookshelfStore } from '../store/bookshelfStore';
import { useDragAndDrop } from './useDragAndDrop';
import { useFileHandler } from './useFileHandler';
import { useStickerPositioning } from './stickers/useStickerPositioning';
import { SlotType } from '../store/types';
import { toast } from 'sonner';

export interface UseBookSlotProps {
  position: number;
  slotType: SlotType;
  onFileSelect?: (file: File) => void;
  onBookDelete?: (bookId: string) => void;
}

export const useBookSlot = ({ 
  position, 
  slotType,
  onFileSelect,
  onBookDelete
}: UseBookSlotProps) => {
  const { activeShelfId, books, deleteBook, openModal } = useBookshelfStore();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  // Get the book at this position and shelf
  const book = Object.values(books).find(
    book => book.position === position && book.shelfId === activeShelfId && !book.isSticker
  );
  
  // Use the sticker positioning hook
  const {
    scale,
    position2D,
    rotation,
    setPosition2D,
    handleRotate,
    handleScaleChange,
    handleResetTransform,
    clampPosition
  } = useStickerPositioning({
    position,
    bookId: book?.id
  });
  
  // Use the file handler hook
  const { fileInputRef, handleFileChange } = useFileHandler({
    position,
    slotType,
    onFileSelect
  });
  
  // Use drag and drop hook
  const {
    handleStickerMouseDown,
    handleStickerMouseMove,
    handleStickerMouseUp,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    isDragging,
    setIsDragging,
    dragStart,
    setDragStart,
    isAltDrag
  } = useDragAndDrop({
    position,
    setPosition2D,
    book,
    slotType
  });
  
  // Handle delete sticker
  const handleDeleteSticker = useCallback(() => {
    if (book) {
      if (onBookDelete) {
        onBookDelete(book.id);
      } else {
        deleteBook(book.id);
        toast.success('Item deleted successfully');
      }
      setShowDeleteDialog(false);
    }
  }, [book, deleteBook, onBookDelete]);

  // Handle clicking on empty slot to trigger file input or open modal
  const handleClick = useCallback(() => {
    console.log("[useBookSlot] handleClick called for slotType:", slotType);
    
    if (slotType === 'book') {
      // For book slots, open the book modal with null ID to create a new book
      console.log("[useBookSlot] Opening book modal");
      openModal(null);
    } else if (slotType === 'recipe') {
      // Recipe slots are handled directly in EmptySlot component
      console.log("[useBookSlot] Recipe slots are handled in EmptySlot");
    } else {
      // For other slot types, trigger file input
      console.log("[useBookSlot] Triggering file input click");
      fileInputRef.current?.click();
    }
  }, [fileInputRef, slotType, openModal]);

  return {
    book,
    fileInputRef,
    scale,
    position2D,
    rotation,
    showDeleteDialog,
    setShowDeleteDialog,
    handleFileChange,
    handleClick,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleStickerMouseDown,
    handleStickerMouseMove,
    handleStickerMouseUp,
    handleRotate,
    handleScaleChange,
    handleResetTransform,
    handleDeleteSticker,
    isDragging,
    setIsDragging,
    dragStart,
    setDragStart,
    isAltDrag
  };
};

export default useBookSlot;
