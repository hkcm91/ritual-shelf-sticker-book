import { useState, useEffect } from 'react';
import { useBookshelfStore } from '../store/bookshelfStore';

type UseStickerDragProps = {
  position: number;
  book: any;
  initialPosition: { x: number, y: number };
  setPosition2D: (value: { x: number, y: number }) => void;
  slotDimensions: { width: number, height: number };
};

export const useStickerDrag = ({
  position,
  book,
  initialPosition,
  setPosition2D,
  slotDimensions
}: UseStickerDragProps) => {
  const { updateBook } = useBookshelfStore();
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number, y: number }>({ x: 0, y: 0 });
  const [isAltDrag, setIsAltDrag] = useState<boolean>(false);

  // Handle mouse down to start dragging
  const handleStickerMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!book?.isSticker) return;
    
    e.stopPropagation();
    e.preventDefault();
    
    // Check if Alt key is pressed for extended boundaries
    setIsAltDrag(e.altKey);
    
    setIsDragging(true);
    setDragStart({
      x: e.clientX,
      y: e.clientY
    });
  };

  // Calculate clamped position based on boundaries
  const calculateClampedPosition = (newX: number, newY: number, isAlt: boolean) => {
    // Calculate sticker's effective dimensions (with scale)
    const stickerScale = book.scale || 1;
    const stickerWidth = slotDimensions.width * 0.8 * stickerScale;
    const stickerHeight = slotDimensions.height * 0.8 * stickerScale;
    
    // Calculate standard boundaries to keep sticker visible within the slot
    let maxX = slotDimensions.width/2 - stickerWidth/4;
    let maxY = slotDimensions.height/2 - stickerHeight/4;
    let minX = -maxX;
    let minY = -maxY;
    
    // If Alt key is pressed, extend boundaries by 20%
    if (isAlt) {
      const extensionFactor = 0.2; // 20% extension
      maxX += slotDimensions.width * extensionFactor;
      maxY += slotDimensions.height * extensionFactor;
      minX -= slotDimensions.width * extensionFactor;
      minY -= slotDimensions.height * extensionFactor;
    }
    
    // Clamp the position within boundaries
    return {
      x: Math.max(minX, Math.min(maxX, newX)),
      y: Math.max(minY, Math.min(maxY, newY))
    };
  };

  // Effect for mouse move and up events
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      // Calculate movement deltas
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;
      
      // Calculate new position
      const newX = initialPosition.x + deltaX;
      const newY = initialPosition.y + deltaY;
      
      // Check if Alt key state has changed during drag
      setIsAltDrag(e.altKey);
      
      // Get clamped position
      const clampedPos = calculateClampedPosition(newX, newY, e.altKey);
      
      setPosition2D(clampedPos);
    };
    
    const handleMouseUp = (e: MouseEvent) => {
      setIsDragging(false);
      
      // Save the final position if needed
      if (book) {
        // This would be handled by the useTransformControls hook
        // You could optionally call updateBook here to update position data in the store
      }
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStart, initialPosition, book, setPosition2D, isAltDrag]);

  return {
    isDragging,
    setIsDragging,
    dragStart,
    setDragStart,
    isAltDrag,
    handleStickerMouseDown
  };
};
