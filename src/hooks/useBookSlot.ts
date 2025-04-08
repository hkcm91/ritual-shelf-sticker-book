
import { useState } from 'react';
import { useBookshelfStore } from '../store/bookshelfStore';
import { useDragAndDrop } from './useDragAndDrop';
import { useFileHandler } from './useFileHandler';
import { useStickerPositioning } from './stickers/useStickerPositioning';

type UseBookSlotProps = {
  position: number;
  slotType: "book" | "sticker";
};

export const useBookSlot = ({ position, slotType }: UseBookSlotProps) => {
  const { activeShelfId, books, deleteBook } = useBookshelfStore();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isAltDrag, setIsAltDrag] = useState(false);
  
  // Get the book at this position and shelf
  const book = Object.values(books).find(
    book => book.position === position && book.shelfId === activeShelfId
  );
  
  // Use the file handler hook
  const { fileInputRef, handleFileChange, handleClick } = useFileHandler({
    position,
    slotType
  });
  
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
  
  // Use drag and drop hook
  const {
    handleStickerMouseDown,
    handleStickerMouseMove,
    handleStickerMouseUp,
    handleDragOver,
    handleDrop,
    isDragging,
    setIsDragging,
    dragStart,
    setDragStart
  } = useDragAndDrop({
    position,
    setPosition2D,
    book,
    slotType
  });
  
  // Handle delete sticker
  const handleDeleteSticker = () => {
    if (book) {
      deleteBook(book.id);
      setShowDeleteDialog(false);
    }
  };

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
    isAltDrag,
    setIsAltDrag
  };
};
