
import { useState, useCallback, useEffect } from 'react';
import { useBookshelfStore } from '../store/bookshelfStore';
import { SlotType } from '@/store/types';
import useSlotFileHandling from './slot/useSlotFileHandling';
import useSlotStickerManagement from './slot/useSlotStickerManagement';
import useSlotDragDrop from './slot/useSlotDragDrop';
import useSlotFileProcessing from './slot/useSlotFileProcessing';
import useSlotInteractions from './slot/useSlotInteractions';

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
    books 
  } = useBookshelfStore();
  
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  // Get the book at this position and shelf
  const book = Object.values(books).find(
    book => book.position === position && book.shelfId === activeShelfId && !book.isSticker
  );
  
  // Log component lifecycle for debugging
  useEffect(() => {
    console.log(`[useBookSlot] Initializing slot at position ${position} with type ${slotType}, has book: ${book ? 'yes' : 'no'}`);
    
    return () => {
      console.log(`[useBookSlot] Unmounting slot at position ${position}`);
    };
  }, [position, slotType, book]);
  
  // Get file processing functionality
  const { processFile } = useSlotFileProcessing({ 
    position, 
    slotType, 
    activeShelfId: activeShelfId || '' 
  });
  
  // Get file handling functionality with custom processing
  const {
    fileInputRef,
    triggerFileInput
  } = useSlotFileHandling({ 
    onFileSelect: (file) => {
      console.log(`[useBookSlot] File selected via slot file handling: ${file.name}`);
      
      if (onFileSelect) {
        onFileSelect(file);
      } else {
        processFile(file);
      }
    },
    slotType,
    position
  });
  
  // Get slot interactions functionality
  const { handleClick } = useSlotInteractions({
    position,
    slotType,
    triggerFileInput
  });
  
  // Get drag and drop functionality
  const {
    isDragOver,
    handleDragOver,
    handleDragLeave,
    handleDrop
  } = useSlotDragDrop({ position, activeShelfId: activeShelfId || '', slotType });
  
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
    activeShelfId: activeShelfId || '', 
    onBookDelete, 
    setShowDeleteDialog 
  });
  
  // Handler for file change directly (from drop events)
  const handleFileChange = useCallback((file: File) => {
    console.log(`[useBookSlot] File change handler called for ${slotType} at position ${position} with file:`, file.name);
    
    if (onFileSelect) {
      onFileSelect(file);
    } else {
      processFile(file);
    }
  }, [onFileSelect, slotType, position, processFile]);

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
