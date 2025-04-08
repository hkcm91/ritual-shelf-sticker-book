
import { useState, useCallback } from 'react';
import { useBookshelfStore } from '../store/bookshelfStore';
import { BookData, SlotType } from '../store/types';
import { toast } from 'sonner';

export interface Point {
  x: number;
  y: number;
}

export interface UseDragAndDropProps {
  position: number;
  setPosition2D?: (position: Point) => void;
  book?: BookData;
  slotType: SlotType;
}

export const useDragAndDrop = ({
  position,
  setPosition2D,
  book,
  slotType
}: UseDragAndDropProps) => {
  const { 
    activeShelfId, 
    updateBook,
    books 
  } = useBookshelfStore();
  
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<Point | null>(null);
  const [isAltDrag, setIsAltDrag] = useState(false);
  
  // Move a book to a new position
  const moveBook = useCallback((bookId: string, position: number) => {
    if (!activeShelfId) return;
    
    console.log("[useDragAndDrop] Moving book:", bookId, "to position:", position);
    // Use updateBook from the store to change the position
    updateBook(bookId, { 
      position,
      shelfId: activeShelfId
    });
    
    toast.success("Book moved successfully");
  }, [activeShelfId, updateBook]);
  
  // Handle mouse down for sticker dragging
  const handleStickerMouseDown = useCallback((e: React.MouseEvent) => {
    if (!book?.isSticker) return;
    
    // Alt key for free movement, regular for grid snapping
    setIsAltDrag(e.altKey);
    
    setIsDragging(true);
    setDragStart({
      x: e.clientX - (book.position2D?.x || 0),
      y: e.clientY - (book.position2D?.y || 0)
    });
    
    e.stopPropagation();
    e.preventDefault();
  }, [book]);
  
  // Handle mouse move for sticker dragging
  const handleStickerMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !dragStart || !book?.isSticker || !setPosition2D) return;
    
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    
    setPosition2D({ x: newX, y: newY });
    e.stopPropagation();
    e.preventDefault();
  }, [isDragging, dragStart, book, setPosition2D]);
  
  // Handle mouse up to end sticker dragging
  const handleStickerMouseUp = useCallback((e: React.MouseEvent) => {
    if (isDragging && book?.isSticker) {
      // Save the new position to the book
      if (book.position2D && setPosition2D) {
        updateBook(book.id, { position2D: book.position2D });
      }
      e.stopPropagation();
      e.preventDefault();
    }
    
    setIsDragging(false);
    setDragStart(null);
  }, [isDragging, book, updateBook, setPosition2D]);
  
  // Handle drag over events for drop targets
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    e.currentTarget.classList.add('drag-over');
  }, []);
  
  // Handle drag leave events to remove visual indicators
  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.currentTarget.classList.remove('drag-over');
  }, []);
  
  // Handle drop events for books
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const target = e.currentTarget;
    target.classList.remove('drag-over');
    
    const droppedBookId = e.dataTransfer.getData('text/plain');
    console.log("[useDragAndDrop] Dropping book:", droppedBookId, "at position:", position);
    
    if (droppedBookId && position !== undefined) {
      // Check if there's already a book at this position
      const existingBook = Object.values(books).find(
        b => b.position === position && b.shelfId === activeShelfId && !b.isSticker
      );
      
      if (existingBook && existingBook.id !== droppedBookId) {
        console.log("[useDragAndDrop] Position already occupied by:", existingBook.id);
        // If occupied, swap positions
        const draggedBook = books[droppedBookId];
        if (draggedBook) {
          console.log("[useDragAndDrop] Swapping positions");
          updateBook(existingBook.id, { position: draggedBook.position });
          moveBook(droppedBookId, position);
          toast.success("Books swapped positions");
        }
      } else {
        // If empty, just move the book
        moveBook(droppedBookId, position);
      }
    }
  }, [position, moveBook, books, activeShelfId, updateBook]);
  
  return {
    handleStickerMouseDown,
    handleStickerMouseMove,
    handleStickerMouseUp,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    isDragging,
    setIsDragging,
    dragStart,
    setDragStart,
    isAltDrag,
    moveBook
  };
};

export default useDragAndDrop;
