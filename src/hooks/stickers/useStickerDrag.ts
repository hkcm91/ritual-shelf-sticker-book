
import { useState, useEffect, useCallback, RefObject } from 'react';
import type { Position2D } from '../transform/types';

export interface UseStickerDragProps {
  position: number;
  bookId?: string;
  initialPosition: { x: number, y: number };
  setPosition2D: (value: { x: number, y: number }) => void;
  containerRef?: RefObject<HTMLDivElement>;
  defaultContainerSize?: { width: number, height: number };
  onDragStart?: () => void;
  onDragEnd?: (position: { x: number, y: number }) => void;
  clampPosition?: (x: number, y: number, isAlt: boolean) => { x: number, y: number };
}

export interface StickerDragState {
  isDragging: boolean;
  dragStart: { x: number, y: number };
  isAltDrag: boolean;
  containerSize: { width: number, height: number };
}

export const useStickerDrag = ({
  position,
  bookId,
  initialPosition,
  setPosition2D,
  containerRef,
  defaultContainerSize = { width: 150, height: 220 },
  onDragStart,
  onDragEnd,
  clampPosition: customClampPosition
}: UseStickerDragProps) => {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number, y: number }>({ x: 0, y: 0 });
  const [isAltDrag, setIsAltDrag] = useState<boolean>(false);
  const [containerSize, setContainerSize] = useState(defaultContainerSize);

  // Update container size when ref changes or on window resize
  useEffect(() => {
    if (!containerRef?.current) return;
    
    const updateContainerSize = () => {
      const { width, height } = containerRef.current?.getBoundingClientRect() || defaultContainerSize;
      setContainerSize({ width, height });
    };
    
    updateContainerSize();
    
    window.addEventListener('resize', updateContainerSize);
    return () => window.removeEventListener('resize', updateContainerSize);
  }, [containerRef, defaultContainerSize]);

  // Default clamp position function
  const defaultClampPosition = useCallback((newX: number, newY: number, isAlt: boolean) => {
    // Calculate standard boundaries
    const stickerScale = 1; // You can make this dynamic if needed
    const stickerWidth = containerSize.width * 0.8 * stickerScale;
    const stickerHeight = containerSize.height * 0.8 * stickerScale;
    
    let maxX = containerSize.width/2 - stickerWidth/4;
    let maxY = containerSize.height/2 - stickerHeight/4;
    let minX = -maxX;
    let minY = -maxY;
    
    // If Alt key is pressed, extend boundaries
    if (isAlt) {
      const extensionFactor = 0.2;
      maxX += containerSize.width * extensionFactor;
      maxY += containerSize.height * extensionFactor;
      minX -= containerSize.width * extensionFactor;
      minY -= containerSize.height * extensionFactor;
    }
    
    // Clamp position within boundaries
    return {
      x: Math.max(minX, Math.min(maxX, newX)),
      y: Math.max(minY, Math.min(maxY, newY))
    };
  }, [containerSize]);
  
  // Use custom clamp function if provided, otherwise use default
  const clampPosition = customClampPosition || defaultClampPosition;

  // Handle mouse down to start dragging
  const handleStickerMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!bookId) return;
    
    e.stopPropagation();
    e.preventDefault();
    
    // Check if Alt key is pressed for extended boundaries
    setIsAltDrag(e.altKey);
    
    setIsDragging(true);
    setDragStart({
      x: e.clientX,
      y: e.clientY
    });
    
    if (onDragStart) {
      onDragStart();
    }
  }, [bookId, onDragStart]);

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
      const currentAltState = e.altKey;
      setIsAltDrag(currentAltState);
      
      // Get clamped position
      const clampedPos = clampPosition(newX, newY, currentAltState);
      
      setPosition2D(clampedPos);
    };
    
    const handleMouseUp = (e: MouseEvent) => {
      setIsDragging(false);
      
      if (onDragEnd) {
        // Calculate final position
        const deltaX = e.clientX - dragStart.x;
        const deltaY = e.clientY - dragStart.y;
        const finalX = initialPosition.x + deltaX;
        const finalY = initialPosition.y + deltaY;
        const clampedPos = clampPosition(finalX, finalY, e.altKey);
        
        onDragEnd(clampedPos);
      }
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStart, initialPosition, clampPosition, setPosition2D, onDragEnd]);

  // Listen for Alt key press/release
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

  return {
    // State
    isDragging,
    dragStart,
    isAltDrag,
    containerSize,
    
    // Setters
    setIsDragging,
    setDragStart,
    setIsAltDrag,
    
    // Handlers
    handleStickerMouseDown
  };
};

export default useStickerDrag;
