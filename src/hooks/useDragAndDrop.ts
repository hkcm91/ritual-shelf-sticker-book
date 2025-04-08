
import { useState, useCallback } from 'react';
import { useBookshelfStore } from '../store/bookshelfStore';
import { BookData, SlotType } from '../store/types';

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
  
  // We need to implement our own moveBook function since it doesn't exist in the store
  const moveBook = useCallback((bookId: string, position: number) => {
    if (!activeShelfId) return;
    
    updateBook(bookId, { position });
  }, [activeShelfId, updateBook]);
  
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
  }, [book]);
  
  const handleStickerMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !dragStart || !book?.isSticker || !setPosition2D) return;
    
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    
    setPosition2D({ x: newX, y: newY });
    e.stopPropagation();
  }, [isDragging, dragStart, book, setPosition2D]);
  
  const handleStickerMouseUp = useCallback(() => {
    setIsDragging(false);
    setDragStart(null);
  }, []);
  
  // Handle drag over events for drop targets
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);
  
  // Handle drop events
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const droppedBookId = e.dataTransfer.getData('text/plain');
    
    if (droppedBookId && position !== undefined) {
      moveBook(droppedBookId, position);
    }
  }, [position, moveBook]);
  
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
    isAltDrag,
    moveBook
  };
};

export default useDragAndDrop;
