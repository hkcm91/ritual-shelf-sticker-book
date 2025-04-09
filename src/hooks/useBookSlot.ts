
import { useState, useCallback, useEffect } from 'react';
import { useBookshelfStore } from '../store/bookshelfStore';
import { SlotType } from '@/store/types';
import { toast } from 'sonner';
import useFileInput from './useFileInput';
import useSlotFileHandling from './slot/useSlotFileHandling';
import useSlotStickerManagement from './slot/useSlotStickerManagement';
import useSlotDragDrop from './slot/useSlotDragDrop';
import { v4 as uuidv4 } from 'uuid';

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
    openModal,
    addBook
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
  
  // Get drag and drop functionality
  const {
    isDragOver,
    handleDragOver,
    handleDragLeave,
    handleDrop
  } = useSlotDragDrop({ position, activeShelfId, slotType });
  
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

  // Process file helper (used when onFileSelect is not provided)
  const processFile = useCallback(async (file: File) => {
    try {
      if (!activeShelfId) {
        toast.error("No active shelf selected");
        return;
      }
      
      console.log(`[useBookSlot] Processing file: ${file.name} for slotType: ${slotType}`);
      
      // Process the file (could be image or JSON for Lottie)
      let isLottie = false;
      let fileContent = '';
      
      // For stickers, check if it's a JSON file (Lottie animation)
      if (slotType === 'sticker' && file.name.endsWith('.json')) {
        console.log(`[useBookSlot] Processing as Lottie JSON file`);
        const text = await file.text();
        try {
          // Validate it's proper JSON
          JSON.parse(text);
          fileContent = text;
          isLottie = true;
        } catch (err) {
          console.error(`[useBookSlot] Invalid JSON file:`, err);
          toast.error("Invalid JSON file");
          return;
        }
      } else {
        // For images, convert to data URL
        console.log(`[useBookSlot] Processing as image file`);
        fileContent = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      }

      // Generate a book ID
      const bookId = uuidv4();
      
      // Create book title from filename
      const fileName = file.name.split('.')[0];
      const title = fileName.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

      // Add the book to the store
      const bookData = {
        id: bookId,
        title,
        author: slotType === 'sticker' ? 'Sticker' : 'Unknown Author',
        position,
        coverURL: fileContent,
        shelfId: activeShelfId,
        isSticker: slotType === 'sticker',
      };
      
      if (slotType === 'sticker') {
        // Initialize sticker properties
        Object.assign(bookData, {
          position2D: { x: 0, y: 0 },
          scale: 1,
          rotation: 0,
          zIndex: 10
        });
      }
      
      addBook(bookData);
      toast.success(`${slotType === 'sticker' ? 'Sticker' : 'Book'} added successfully!`);
    } catch (error) {
      console.error(`[useBookSlot] Error processing file:`, error);
      toast.error(`Failed to add ${slotType}. Please try again.`);
    }
  }, [slotType, position, activeShelfId, addBook]);

  // Handle clicking on empty slot
  const handleClick = useCallback(() => {
    console.log(`[useBookSlot] handleClick called for slotType: ${slotType} at position ${position}`);
    
    if (slotType === 'book') {
      // For book slots, open the book modal with null ID to create a new book
      console.log(`[useBookSlot] Opening book modal`);
      openModal(null);
    } else if (slotType === 'recipe') {
      // Recipe slots are handled directly in EmptySlot component
      console.log(`[useBookSlot] Recipe slots are handled in EmptySlot`);
    } else if (slotType === 'sticker') {
      // For sticker slots, trigger the file input
      console.log(`[useBookSlot] Triggering file input for sticker`);
      triggerFileInput();
    } else {
      // For other types, trigger the file input
      console.log(`[useBookSlot] Triggering file input for ${slotType}`);
      triggerFileInput();
    }
  }, [slotType, position, openModal, triggerFileInput]);
  
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
