
import { useState, useCallback, useRef } from 'react';
import { useBookshelfStore } from '../store/bookshelfStore';
import { useDragAndDrop } from './useDragAndDrop';
import { useFileHandler } from './useFileHandler';
import { useStickerPositioning } from './stickers/useStickerPositioning';

export interface UseBookSlotProps {
  position: number;
  slotType?: "book" | "sticker";
  onFileSelect?: (file: File) => void;
  onBookDelete?: (bookId: string) => void;
}

export const useBookSlot = ({ 
  position, 
  slotType = "book",
  onFileSelect,
  onBookDelete
}: UseBookSlotProps) => {
  const { activeShelfId, books, deleteBook } = useBookshelfStore();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  // Get the book at this position and shelf
  const book = Object.values(books).find(
    book => book.position === position && book.shelfId === activeShelfId
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
  const { fileInputRef, handleFileChange, handleClick } = useFileHandler({
    position,
    slotType: slotType || "book",
    onFileSelect
  });
  
  // Use drag and drop hook - now correctly passing setPosition2D
  const {
    handleStickerMouseDown,
    handleStickerMouseMove,
    handleStickerMouseUp,
    handleDragOver,
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
    slotType: slotType || "book"
  });
  
  // Handle delete sticker
  const handleDeleteSticker = useCallback(() => {
    if (book) {
      if (onBookDelete) {
        onBookDelete(book.id);
      } else {
        deleteBook(book.id);
      }
      setShowDeleteDialog(false);
    }
  }, [book, deleteBook, onBookDelete]);

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
