import { useState, useCallback } from 'react';
import { useBookshelfStore } from '../store/bookshelfStore';
import { useDragAndDrop } from './useDragAndDrop';
import { useFileHandler } from './useFileHandler';
import { useStickerPositioning } from './stickers/useStickerPositioning';

export interface UseBookSlotProps {
  position: number;
  slotType: "book" | "sticker" | "recipe";
  onFileSelect?: (file: File) => void;
  onBookDelete?: (bookId: string) => void;
}

export const useBookSlot = ({ 
  position, 
  slotType,
  onFileSelect,
  onBookDelete
}: UseBookSlotProps) => {
  const { activeShelfId, books, deleteBook } = useBookshelfStore();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  const book = Object.values(books).find(
    book => book.position === position && book.shelfId === activeShelfId
  );
  
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
  
  const { fileInputRef, handleFileChange, handleClick } = useFileHandler({
    position,
    slotType,
    onFileSelect
  });
  
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
    slotType
  });
  
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
