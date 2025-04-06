
import { useState, useEffect } from 'react';
import { useBookshelfStore } from '../store/bookshelfStore';
import { useTransformControls } from './useTransformControls';
import { useDragAndDrop } from './useDragAndDrop';
import { useFileHandler } from './useFileHandler';
import { toast } from 'sonner';

type UseBookSlotProps = {
  position: number;
  slotType?: "book" | "sticker";
};

export const useBookSlot = ({ position, slotType = "book" }: UseBookSlotProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
  const [isAltKeyPressed, setIsAltKeyPressed] = useState<boolean>(false);
  const { books, activeShelfId, deleteBook } = useBookshelfStore();
  
  // Get the book from the store
  const book = Object.values(books).find(
    (book) => book.shelfId === activeShelfId && book.position === position
  );
  
  // Use the transform controls hook
  const {
    scale,
    position2D,
    setPosition2D,
    rotation,
    handleRotate,
    handleScaleChange,
    handleResetTransform,
    clearTransformData
  } = useTransformControls({ activeShelfId, position });
  
  // Use the file handler hook
  const {
    fileInputRef,
    handleFileChange,
    handleClick: handleFileClick
  } = useFileHandler({ position, slotType });
  
  // Listen for Alt key press/release
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Alt') {
        setIsAltKeyPressed(true);
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Alt') {
        setIsAltKeyPressed(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);
  
  // Use the drag and drop hook
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
  
  // Handle deletion
  const handleDeleteSticker = () => {
    if (book) {
      deleteBook(book.id);
      setShowDeleteDialog(false);
      clearTransformData();
      toast.success('Item removed');
    }
  };

  // Handle click to either open the file input or do nothing if there's a book
  const handleClick = () => {
    if (!book) {
      handleFileClick();
    }
  };

  return {
    book,
    fileInputRef,
    scale,
    position2D,
    rotation,
    isDragging,
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
    isAltDrag: isDragging && isAltKeyPressed
  };
};
