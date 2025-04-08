
import { useState, useCallback, useEffect } from 'react';
import { useBookshelfStore } from '../../store/bookshelfStore';

interface UseStickerDragProps {
  position: number;
  bookId?: string; 
  initialPosition: { x: number, y: number };
  setPosition2D: (position: { x: number, y: number }) => void;
  defaultContainerSize: { width: number, height: number };
}

export const useStickerDrag = ({
  position,
  bookId,
  initialPosition,
  setPosition2D,
  defaultContainerSize
}: UseStickerDragProps) => {
  const { updateBook } = useBookshelfStore();
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isAltDrag, setIsAltDrag] = useState(false);
  const [containerSize, setContainerSize] = useState(defaultContainerSize);
  
  // Handle mouse down to start dragging
  const handleStickerMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return; // Only left mouse button
    
    // Stop propagation to prevent parent handlers from triggering
    e.stopPropagation();
    
    // Check if Alt key is pressed for "extended" dragging beyond container
    setIsAltDrag(e.altKey);
    
    // Set initial mouse position
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  }, []);
  
  // Handle mouse move (only when dragging)
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    
    // Calculate distance moved
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    
    // Calculate new position (with boundaries if not Alt dragging)
    const newPos = calculateNewPosition(initialPosition, dx, dy, isAltDrag, containerSize);
    
    // Update position
    setPosition2D(newPos);
  }, [isDragging, dragStart, initialPosition, isAltDrag, containerSize, setPosition2D]);
  
  // Handle mouse up to end dragging
  const handleMouseUp = useCallback(() => {
    if (isDragging && bookId) {
      // Save the new position to the store
      updateBook(bookId, { position2D: initialPosition });
    }
    
    setIsDragging(false);
  }, [isDragging, bookId, initialPosition, updateBook]);
  
  // Cleanup: Add global event listeners to handle edge cases
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
      }
    };
    
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Alt' && isDragging) {
        setIsAltDrag(true);
      }
    };
    
    const handleGlobalKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Alt') {
        setIsAltDrag(false);
      }
    };
    
    window.addEventListener('mouseup', handleGlobalMouseUp);
    window.addEventListener('keydown', handleGlobalKeyDown);
    window.addEventListener('keyup', handleGlobalKeyUp);
    
    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp);
      window.removeEventListener('keydown', handleGlobalKeyDown);
      window.removeEventListener('keyup', handleGlobalKeyUp);
    };
  }, [isDragging]);
  
  // Helper function to calculate new position with boundaries
  const calculateNewPosition = (
    currentPos: { x: number, y: number },
    deltaX: number,
    deltaY: number,
    allowOutOfBounds: boolean,
    containerDimensions: { width: number, height: number }
  ) => {
    const newX = currentPos.x + deltaX;
    const newY = currentPos.y + deltaY;
    
    if (allowOutOfBounds) {
      return { x: newX, y: newY };
    }
    
    // Constrain to container boundaries with some margin
    const maxX = containerDimensions.width / 2;
    const maxY = containerDimensions.height / 2;
    
    return {
      x: Math.max(-maxX, Math.min(maxX, newX)),
      y: Math.max(-maxY, Math.min(maxY, newY))
    };
  };
  
  return {
    isDragging,
    dragStart,
    isAltDrag,
    containerSize,
    setIsDragging,
    setDragStart,
    setIsAltDrag,
    handleStickerMouseDown,
    handleMouseMove,
    handleMouseUp
  };
};

export default useStickerDrag;
