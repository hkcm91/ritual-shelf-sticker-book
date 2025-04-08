
import { useCallback } from 'react';
import { useBookshelfStore } from '../../store/bookshelfStore';
import { toast } from 'sonner';

export interface UsePositionSwapProps {
  position: number;
  activeShelfId: string;
}

const usePositionSwap = ({ position, activeShelfId }: UsePositionSwapProps) => {
  const { books, updateBook } = useBookshelfStore();
  
  // Check if a position is occupied
  const isPositionOccupied = useCallback((position: number, shelfId: string) => {
    return Object.values(books).some(
      book => book.position === position && book.shelfId === shelfId && !book.isSticker
    );
  }, [books]);
  
  // Get book at a specific position
  const getBookAtPosition = useCallback((position: number, shelfId: string) => {
    return Object.values(books).find(
      book => book.position === position && book.shelfId === shelfId && !book.isSticker
    );
  }, [books]);
  
  // Swap positions between two books
  const swapPositions = useCallback((bookId1: string, bookId2: string) => {
    if (!books[bookId1] || !books[bookId2]) return false;
    
    const position1 = books[bookId1].position;
    const position2 = books[bookId2].position;
    
    updateBook(bookId1, { position: position2 });
    updateBook(bookId2, { position: position1 });
    
    toast.success("Books swapped positions");
    return true;
  }, [books, updateBook]);
  
  // Move a book to a position, swapping if necessary
  const moveBookToPosition = useCallback((bookId: string, newPosition: number, newShelfId: string = activeShelfId) => {
    if (!books[bookId]) return false;
    
    const existingBook = getBookAtPosition(newPosition, newShelfId);
    
    if (existingBook && existingBook.id !== bookId) {
      return swapPositions(bookId, existingBook.id);
    } else {
      updateBook(bookId, { 
        position: newPosition,
        shelfId: newShelfId
      });
      
      toast.success("Book moved successfully");
      return true;
    }
  }, [books, activeShelfId, getBookAtPosition, swapPositions, updateBook]);
  
  return {
    isPositionOccupied,
    getBookAtPosition,
    swapPositions,
    moveBookToPosition
  };
};

export default usePositionSwap;
