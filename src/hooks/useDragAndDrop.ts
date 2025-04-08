
import { useState, useEffect, useCallback } from 'react';
import { useStickerDrag } from './stickers/useStickerDrag';
import { useFileDropHandler } from './useFileDropHandler';
import { useBookDragHandler } from './useBookDragHandler';

export interface UseDragAndDropProps {
  position: number;
  setPosition2D: (value: { x: number, y: number }) => void;
  book: any;
  slotType?: "book" | "sticker" | "recipe";
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
  
  const { 
    isDragging, 
    setIsDragging,
    dragStart, 
    setDragStart,
    handleStickerMouseDown,
    isAltDrag,
    handleMouseMove,
    handleMouseUp
  } = useStickerDrag({
    position,
    bookId: book?.id,
    initialPosition,
    setPosition2D,
    defaultContainerSize: slotDimensions
  });
  
  useEffect(() => {
    const updateDimensions = () => {
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
  
  useEffect(() => {
    if (!isDragging) {
      setInitialPosition(currentPosition => ({
        x: currentPosition.x,
        y: currentPosition.y
      }));
    }
  }, [isDragging]);
  
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);
  
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleFileDrop(file);
      return;
    }
    
    handleBookDrop();
  }, [handleFileDrop, handleBookDrop]);
  
  // Use the mouse move/up handlers from useStickerDrag
  const handleStickerMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (handleMouseMove) {
      handleMouseMove(e);
    }
  }, [handleMouseMove]);
  
  const handleStickerMouseUp = useCallback(() => {
    if (handleMouseUp) {
      handleMouseUp();
    }
  }, [handleMouseUp]);

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
