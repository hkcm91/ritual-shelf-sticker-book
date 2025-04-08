import { useState, useCallback, useEffect } from 'react';
import { useBookshelfStore } from '../store/bookshelfStore';
import { BookData, SlotType } from '../store/types';
import { toast } from 'sonner';

interface UseDragAndDropProps {
  position: number;
  setPosition2D: (newPosition: { x: number; y: number }) => void;
  book?: BookData;
  slotType: SlotType;
}

export const useDragAndDrop = ({ 
  position, 
  setPosition2D,
  book,
  slotType
}: UseDragAndDropProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isAltDrag, setIsAltDrag] = useState(false);
  
  const { moveBook, activeShelfId, books, addBook } = useBookshelfStore();
  
  // Handle key press to toggle alt drag mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Alt') {
        setIsAltDrag(true);
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Alt') {
        setIsAltDrag(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);
  
  // Handle mouse down for sticker dragging
  const handleStickerMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (book?.isSticker) {
        e.stopPropagation();
        setIsDragging(true);
        setDragStart({ x: e.clientX, y: e.clientY });
      }
    },
    [book]
  );
  
  // Handle mouse move for dragging stickers
  const handleStickerMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isDragging && book?.isSticker && book.position2D) {
        e.preventDefault();
        
        // Calculate the distance moved
        const dx = e.clientX - dragStart.x;
        const dy = e.clientY - dragStart.y;
        
        // Update the position
        const newX = book.position2D.x + dx;
        const newY = book.position2D.y + dy;
        
        // Update the state
        setPosition2D({ x: newX, y: newY });
        
        // Update the drag start position
        setDragStart({ x: e.clientX, y: e.clientY });
      }
    },
    [isDragging, book, dragStart, setPosition2D]
  );
  
  // Handle mouse up for dragging stickers
  const handleStickerMouseUp = useCallback(
    () => {
      if (isDragging) {
        setIsDragging(false);
      }
    },
    [isDragging]
  );
  
  // Handle drag over for dropping books
  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
    },
    []
  );
  
  // Handle drop for books
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      
      // Get the dragged book's ID
      const bookId = e.dataTransfer.getData("book/id");
      
      if (!bookId) {
        console.error("No book ID found in drag data");
        return;
      }
      
      // Get the source and target positions
      const sourceBook = books[bookId];
      
      if (!sourceBook) {
        console.error("Source book not found:", bookId);
        return;
      }
      
      // If dropping to the same position, do nothing
      if (sourceBook.position === position && sourceBook.shelfId === activeShelfId) {
        return;
      }
      
      // Check if there's already a book at this position
      const targetBookExists = Object.values(books).some(
        b => b.position === position && b.shelfId === activeShelfId && b.id !== bookId
      );
      
      // If there's a book at the target position, swap them
      if (targetBookExists) {
        moveBook(bookId, position);
        toast.success("Books swapped successfully");
      } else {
        // Otherwise, simply move the book to this position
        moveBook(bookId, position);
        toast.success("Book moved successfully");
      }
    },
    [books, position, activeShelfId, moveBook]
  );
  
  return {
    handleStickerMouseDown,
    handleStickerMouseMove,
    handleStickerMouseUp,
    handleDragOver,
    handleDrop,
    isDragging,
    setIsDragging,
    dragStart,
    setDragStart,
    isAltDrag
  };
};

export default useDragAndDrop;
