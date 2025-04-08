
import { useCallback } from 'react';
import { useBookshelfStore } from '../store/bookshelfStore';
import { toast } from 'sonner';

export interface UseBookDragHandlerProps {
  position: number;
  book: any;
  onBookDrop?: (bookId: string, position: number) => void;
}

export const useBookDragHandler = ({
  position,
  book,
  onBookDrop
}: UseBookDragHandlerProps) => {
  const { activeShelfId, updateBook, getDraggedBook } = useBookshelfStore();
  
  const handleBookDrop = useCallback(() => {
    const draggedBook = getDraggedBook();
    
    if (!draggedBook || book) return false; // Only allow dropping onto empty slots
    
    // Custom book drop handler
    if (onBookDrop) {
      onBookDrop(draggedBook.id, position);
      return true;
    }
    
    // Default handling of dropped books
    updateBook(draggedBook.id, {
      position: position,
      shelfId: activeShelfId
    });
    
    toast.success('Book moved successfully');
    return true;
  }, [getDraggedBook, book, onBookDrop, position, updateBook, activeShelfId]);
  
  return {
    handleBookDrop
  };
};

export default useBookDragHandler;
