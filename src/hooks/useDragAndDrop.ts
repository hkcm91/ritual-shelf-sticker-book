
import { useState, useEffect, useCallback } from 'react';
import { useStickerDrag } from './stickers/useStickerDrag';
import { useFileDropHandler } from './useFileDropHandler';
import { useBookDragHandler } from './useBookDragHandler';

export interface UseDragAndDropProps {
  position: number;
  setPosition2D: (value: { x: number, y: number }) => void;
  book: any;
  slotType?: "book" | "sticker";
  onDrop?: (file: File) => void;
  onBookDrop?: (bookId: string, position: number) => void;
  acceptedFileTypes?: string[];
}

export interface DragAndDropResult {
  handleStickerMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleStickerMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleStickerMouseUp: () => void;
  handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  isDragging: boolean;
  setIsDragging: (value: boolean) => void;
  dragStart: { x: number, y: number };
  setDragStart: (value: { x: number, y: number }) => void;
  isAltDrag?: boolean;
}

export const useDragAndDrop = ({
  position,
  setPosition2D,
  book,
  slotType = "book",
  onDrop,
  onBookDrop,
  acceptedFileTypes = []
}: UseDragAndDropProps): DragAndDropResult => {
  const [slotDimensions, setSlotDimensions] = useState({ width: 150, height: 220 });
  const [initialPosition, setInitialPosition] = useState({ x: 0, y: 0 });
  
  // Use specialized hooks
  const { handleFileDrop } = useFileDropHandler({
    position,
    onDrop,
    slotType,
    acceptedFileTypes
  });
  
  const { handleBookDrop } = useBookDragHandler({
    position,
    book,
    onBookDrop
  });
  
  // Use the sticker drag hook
  const { 
    isDragging, 
    setIsDragging,
    dragStart, 
    setDragStart,
    handleStickerMouseDown,
    isAltDrag 
  } = useStickerDrag({
    position,
    bookId: book?.id,
    initialPosition,
    setPosition2D,
    defaultContainerSize: slotDimensions
  });
  
  // Update slot dimensions when window resizes
  useEffect(() => {
    const updateDimensions = () => {
      // Use standard slot dimensions as a fallback
      const slot = document.querySelector(`.book-slot[data-position="${position}"]`);
      if (slot) {
        const { width, height } = slot.getBoundingClientRect();
        setSlotDimensions({ width, height });
      } else {
        setSlotDimensions({ width: 150, height: 220 });
      }
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [position]);
  
  // Update initial position when position2D changes
  useEffect(() => {
    if (!isDragging) {
      setInitialPosition(currentPosition => ({
        x: currentPosition.x,
        y: currentPosition.y
      }));
    }
  }, [isDragging]);
  
  // Handle drag over to allow drop
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);
  
  // Handle drop to place a book into this slot
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    
    // First check if there are files being dropped
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleFileDrop(file);
      return;
    }
    
    // If no files, try handling book drop
    handleBookDrop();
  }, [handleFileDrop, handleBookDrop]);
  
  // Helper functions for sticker mouse movement (placeholder functions since actual logic is in useStickerDrag)
  const handleStickerMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    // This is now handled in the useStickerDrag hook
  }, []);
  
  const handleStickerMouseUp = useCallback(() => {
    // This is now handled in the useStickerDrag hook
  }, []);

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
