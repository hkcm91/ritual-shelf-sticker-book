
import { useState, useCallback, useRef } from 'react';
import { useBookshelfStore } from '../store/bookshelfStore';
import { SlotType } from '@/store/types';
import { toast } from 'sonner';
import useFileInput from './useFileInput';
import useTransformControls from './useTransformControls';
import useStickerDrag from './useStickerDrag';

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
  const { 
    activeShelfId, 
    books, 
    deleteBook, 
    openModal, 
    updateBook, 
    setDraggedBook 
  } = useBookshelfStore();
  
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  
  // Get the book at this position and shelf
  const book = Object.values(books).find(
    book => book.position === position && book.shelfId === activeShelfId && !book.isSticker
  );
  
  // Set up file input handling
  const { fileInputRef, handleClick: triggerFileInput } = useFileInput({
    onFileSelect
  });
  
  // Handle dragging events
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setIsDragOver(true);
  }, []);
  
  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);
  
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const droppedBookId = e.dataTransfer.getData('text/plain');
    console.log("[useBookSlot] Dropping book:", droppedBookId, "at position:", position);
    
    if (droppedBookId && position !== undefined) {
      // Check if there's already a book at this position
      const existingBook = Object.values(books).find(
        b => b.position === position && b.shelfId === activeShelfId && !b.isSticker
      );
      
      if (existingBook && existingBook.id !== droppedBookId) {
        console.log("[useBookSlot] Position already occupied by:", existingBook.id);
        // If occupied, swap positions
        const draggedBook = books[droppedBookId];
        if (draggedBook) {
          console.log("[useBookSlot] Swapping positions");
          updateBook(existingBook.id, { position: draggedBook.position });
          updateBook(droppedBookId, { position, shelfId: activeShelfId });
          toast.success("Books swapped positions");
        }
      } else {
        // If empty, just move the book
        updateBook(droppedBookId, { position, shelfId: activeShelfId });
        toast.success("Book moved successfully");
      }
      
      // Clear dragged book
      setDraggedBook(null);
    }
  }, [position, books, activeShelfId, updateBook, setDraggedBook]);
  
  // Handle sticker operations
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

  // Setup transform controls for stickers
  const {
    scale, 
    position2D, 
    rotation,
    handleRotate,
    handleScaleChange,
    handleResetTransform,
    setPosition2D
  } = useTransformControls({
    activeShelfId,
    position,
    initialScale: 1,
    initialPosition: { x: 0, y: 0 },
    initialRotation: 0
  });

  // Setup sticker drag functionality
  const {
    isDragging,
    setIsDragging,
    dragStart,
    setDragStart,
    isAltDrag,
    handleStickerMouseDown
  } = useStickerDrag({
    position,
    bookId: book?.id,
    initialPosition: position2D,
    setPosition2D
  });

  // Handle clicking on empty slot
  const handleClick = useCallback(() => {
    console.log("[useBookSlot] handleClick called for slotType:", slotType);
    
    if (slotType === 'book') {
      // For book slots, open the book modal with null ID to create a new book
      console.log("[useBookSlot] Opening book modal");
      openModal(null);
    } else if (slotType === 'recipe') {
      // Recipe slots are handled directly in EmptySlot component
      console.log("[useBookSlot] Recipe slots are handled in EmptySlot");
    } else if (slotType === 'sticker') {
      // For sticker slots, trigger the file input
      triggerFileInput();
    }
  }, [slotType, openModal, triggerFileInput]);

  // Optional file change handler
  const handleFileChange = useCallback((file: File) => {
    if (onFileSelect) {
      onFileSelect(file);
    }
  }, [onFileSelect]);

  // Empty stub handlers for mouse events (actual implementation in useStickerDrag)
  const handleStickerMouseMove = useCallback((e: React.MouseEvent) => {
    // This is intentionally empty - implementation handled in useStickerDrag
  }, []);

  const handleStickerMouseUp = useCallback((e: React.MouseEvent) => {
    // This is intentionally empty - implementation handled in useStickerDrag
  }, []);

  return {
    // Core slot properties
    book,
    showDeleteDialog,
    setShowDeleteDialog,
    handleClick,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleDeleteSticker,
    isDragOver,
    
    // File handling
    fileInputRef,
    handleFileChange,
    
    // Transform controls
    scale,
    position2D,
    rotation,
    handleRotate,
    handleScaleChange,
    handleResetTransform,
    
    // Sticker drag
    isDragging,
    setIsDragging,
    dragStart,
    setDragStart,
    isAltDrag,
    handleStickerMouseDown,
    handleStickerMouseMove,
    handleStickerMouseUp
  };
};

export default useBookSlot;
