
import { useState, useCallback, useEffect, useRef } from 'react';
import { useBookshelfStore } from '../../store/bookshelfStore';
import { toast } from 'sonner';
import { SlotType } from '@/store/types';

interface UseSlotDragDropProps {
  position: number;
  activeShelfId: string;
  slotType: SlotType;
}

const useSlotDragDrop = ({ position, activeShelfId, slotType }: UseSlotDragDropProps) => {
  const { books, updateBook, setDraggedBook } = useBookshelfStore();
  const [isDragOver, setIsDragging] = useState(false);
  const lastDropRef = useRef<number>(0); // Timestamp of last drop to prevent duplicates
  
  // Reset drag state if component unmounts while dragging over
  useEffect(() => {
    return () => {
      if (isDragOver) {
        console.log(`[useSlotDragDrop] Cleaning up drag state on unmount for position ${position}`);
        setIsDragging(false);
      }
    };
  }, [isDragOver, position]);
  
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Get information about dragged data
    const hasFiles = e.dataTransfer.types.includes('Files');
    const hasText = e.dataTransfer.types.includes('text/plain');
    
    console.log(`[useSlotDragDrop] Drag over at position ${position}, slotType ${slotType}. Has files: ${hasFiles}, Has text: ${hasText}`);
    
    // Set dragover state to provide visual feedback
    if (!isDragOver) {
      setIsDragging(true);
    }
    
    // Set the drop effect
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = 'move';
    }
  }, [isDragOver, position, slotType]);
  
  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log(`[useSlotDragDrop] Drag leave at position ${position}`);
    setIsDragging(false);
  }, [position]);
  
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    // Debounce drops to prevent duplicate processing
    const now = Date.now();
    if (now - lastDropRef.current < 300) {
      console.log(`[useSlotDragDrop] Ignoring duplicate drop event at position ${position}`);
      return;
    }
    lastDropRef.current = now;
    
    console.log(`[useSlotDragDrop] Processing drop at position ${position}, slotType ${slotType}`);
    
    // Check for file drops first - log but don't handle here
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      console.log(`[useSlotDragDrop] File dropped at position ${position}: ${file.name} - will be handled by component`);
      return;
    }
    
    try {
      const droppedBookId = e.dataTransfer.getData('text/plain');
      console.log(`[useSlotDragDrop] Book dropped: ${droppedBookId}, at position: ${position}`);
      
      if (!droppedBookId || position === undefined) {
        console.log(`[useSlotDragDrop] Invalid drop data or position`);
        return;
      }
      
      // Check if there's a book at this position
      const existingBook = Object.values(books).find(
        b => b.position === position && b.shelfId === activeShelfId && !b.isSticker
      );
      
      if (existingBook && existingBook.id !== droppedBookId) {
        // Swap positions
        console.log(`[useSlotDragDrop] Existing book found at position ${position}: ${existingBook.id}, performing swap`);
        const draggedBook = books[droppedBookId];
        if (draggedBook) {
          updateBook(existingBook.id, { position: draggedBook.position });
          updateBook(droppedBookId, { position, shelfId: activeShelfId });
          toast.success("Books swapped positions");
        }
      } else {
        // Move to empty slot
        console.log(`[useSlotDragDrop] Moving book ${droppedBookId} to empty position ${position}`);
        updateBook(droppedBookId, { position, shelfId: activeShelfId });
        toast.success("Book moved successfully");
      }
      
      // Ensure dragged book state is cleared
      setDraggedBook(null);
    } catch (error) {
      console.error(`[useSlotDragDrop] Error in handleDrop at position ${position}:`, error);
      toast.error("Failed to process dropped item");
    }
  }, [position, books, activeShelfId, updateBook, setDraggedBook, slotType]);
  
  return {
    isDragOver,
    setIsDragging,
    handleDragOver,
    handleDragLeave,
    handleDrop
  };
};

export default useSlotDragDrop;
