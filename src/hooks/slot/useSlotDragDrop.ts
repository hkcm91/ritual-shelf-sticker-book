
import { useState, useCallback } from 'react';
import { useBookshelfStore } from '../../store/bookshelfStore';
import { toast } from 'sonner';

interface UseSlotDragDropProps {
  position: number;
  activeShelfId: string;
}

const useSlotDragDrop = ({ position, activeShelfId }: UseSlotDragDropProps) => {
  const { books, updateBook, setDraggedBook } = useBookshelfStore();
  const [isDragOver, setIsDragging] = useState(false);
  
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);
  
  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);
  
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    // Check for file drops first
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      console.log("[useSlotDragDrop] File dropped - handling will be done in component");
      return;
    }
    
    try {
      const droppedBookId = e.dataTransfer.getData('text/plain');
      console.log("[useSlotDragDrop] Book dropped:", droppedBookId, "at position:", position);
      
      if (!droppedBookId || position === undefined) {
        return;
      }
      
      // When using these functions from Zustand store, we need to wrap them in
      // a timeout to avoid any potential React state update conflicts
      setTimeout(() => {
        // Check if there's a book at this position
        const existingBook = Object.values(books).find(
          b => b.position === position && b.shelfId === activeShelfId && !b.isSticker
        );
        
        if (existingBook && existingBook.id !== droppedBookId) {
          // Swap positions
          const draggedBook = books[droppedBookId];
          if (draggedBook) {
            updateBook(existingBook.id, { position: draggedBook.position });
            updateBook(droppedBookId, { position, shelfId: activeShelfId });
            toast.success("Books swapped positions");
          }
        } else {
          // Move to empty slot
          updateBook(droppedBookId, { position, shelfId: activeShelfId });
          toast.success("Book moved successfully");
        }
        
        setDraggedBook(null);
      }, 50);
    } catch (error) {
      console.error("[useSlotDragDrop] Error in handleDrop:", error);
      toast.error("Failed to process dropped item");
    }
  }, [position, books, activeShelfId, updateBook, setDraggedBook]);
  
  return {
    isDragOver,
    setIsDragging,
    handleDragOver,
    handleDragLeave,
    handleDrop
  };
};

export default useSlotDragDrop;
