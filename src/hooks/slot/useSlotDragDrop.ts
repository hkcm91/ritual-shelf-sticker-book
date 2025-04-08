
import { useState, useCallback } from 'react';
import { useBookshelfStore } from '../../store/bookshelfStore';
import { toast } from 'sonner';

interface UseSlotDragDropProps {
  position: number;
  activeShelfId: string;
}

const useSlotDragDrop = ({ position, activeShelfId }: UseSlotDragDropProps) => {
  const { books, updateBook, setDraggedBook } = useBookshelfStore();
  const [isDragOver, setIsDragOver] = useState(false);
  
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
  }, [position, books, activeShelfId, updateBook, setDraggedBook]);
  
  return {
    isDragOver,
    setIsDragOver,
    handleDragOver,
    handleDragLeave,
    handleDrop
  };
};

export default useSlotDragDrop;
