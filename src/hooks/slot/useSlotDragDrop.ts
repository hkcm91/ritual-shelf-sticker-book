
import { useState, useCallback } from 'react';
import { useBookshelfStore } from '../../store/bookshelfStore';
import { toast } from 'sonner';

interface UseSlotDragDropProps {
  position: number;
  activeShelfId: string;
}

const useSlotDragDrop = ({ position, activeShelfId }: UseSlotDragDropProps) => {
  const { books, updateBook, setDraggedBook, getDraggedBook } = useBookshelfStore();
  const [isDragOver, setIsDragOver] = useState(false);
  
  // Handle dragging events
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';
    setIsDragOver(true);
    
    // Visually highlight the drop target
    if (e.currentTarget && e.currentTarget.classList) {
      e.currentTarget.classList.add('drag-over');
    }
  }, []);
  
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
    
    // Visually highlight the drop target
    if (e.currentTarget && e.currentTarget.classList) {
      e.currentTarget.classList.add('drag-over');
    }
  }, []);
  
  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    
    // Remove visual highlight
    if (e.currentTarget && e.currentTarget.classList) {
      e.currentTarget.classList.remove('drag-over');
    }
  }, []);
  
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    
    // Remove visual highlight
    if (e.currentTarget && e.currentTarget.classList) {
      e.currentTarget.classList.remove('drag-over');
    }
    
    // Check for file drops
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      console.log("[useSlotDragDrop] File dropped, handling in component");
      return; // File handling should be done in the component
    }
    
    // Check if there's any book data available
    try {
      const droppedBookId = e.dataTransfer.getData('text/plain');
      console.log("[useSlotDragDrop] Dropping book:", droppedBookId, "at position:", position);
      
      if (droppedBookId && position !== undefined) {
        // Check if there's already a book at this position
        const existingBook = Object.values(books).find(
          b => b.position === position && b.shelfId === activeShelfId && !b.isSticker
        );
        
        if (existingBook && existingBook.id !== droppedBookId) {
          console.log("[useSlotDragDrop] Position already occupied by:", existingBook.id);
          // If occupied, swap positions
          const draggedBook = books[droppedBookId];
          if (draggedBook) {
            console.log("[useSlotDragDrop] Swapping positions");
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
    } catch (error) {
      console.error("[useSlotDragDrop] Error in handleDrop:", error);
      toast.error("Failed to process dropped item");
    }
  }, [position, books, activeShelfId, updateBook, setDraggedBook]);
  
  return {
    isDragOver,
    setIsDragOver,
    handleDragOver,
    handleDragEnter,
    handleDragLeave,
    handleDrop
  };
};

export default useSlotDragDrop;
