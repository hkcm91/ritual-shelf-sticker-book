
import { useState, useCallback } from 'react';
import { useBookshelfStore } from '../store/bookshelfStore';
import { SlotType } from '@/store/types';
import { toast } from 'sonner';
import useFileInput from './useFileInput';
import useTransformControls from './useTransformControls';
import useStickerDrag from './useStickerDrag';
import useSlotDragDrop from './slot/useSlotDragDrop';
import useSlotFileHandling from './slot/useSlotFileHandling';
import useSlotStickerManagement from './slot/useSlotStickerManagement';

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
    openModal
  } = useBookshelfStore();
  
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  // Get the book at this position and shelf
  const book = Object.values(books).find(
    book => book.position === position && book.shelfId === activeShelfId && !book.isSticker
  );
  
  // Get drag and drop functionality
  const {
    isDragOver,
    handleDragOver,
    handleDragLeave,
    handleDrop
  } = useSlotDragDrop({ position, activeShelfId });
  
  // Get file handling functionality
  const {
    fileInputRef,
    handleFileChange,
    triggerFileInput
  } = useSlotFileHandling({ onFileSelect });
  
  // Get sticker management functionality
  const {
    handleDeleteSticker,
    scale,
    position2D,
    rotation,
    handleRotate,
    handleScaleChange,
    handleResetTransform,
    isDragging,
    setIsDragging,
    dragStart,
    setDragStart,
    isAltDrag,
    handleStickerMouseDown,
    handleStickerMouseMove,
    handleStickerMouseUp
  } = useSlotStickerManagement({ 
    book, 
    position, 
    activeShelfId, 
    onBookDelete, 
    setShowDeleteDialog 
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
