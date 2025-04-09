import { useState, useEffect, useCallback } from 'react';
import { useBookshelfStore } from '../../store/bookshelfStore';
import { toast } from 'sonner';
import type { Position2D } from '../transform/types';

interface UseStickerPositioningProps {
  position: number;
  bookId?: string;
  initialScale?: number;
  initialRotation?: number;
  initialPosition?: Position2D;
  slotDimensions?: { width: number, height: number };
}

export const useStickerPositioning = ({
  position,
  bookId,
  initialScale = 1,
  initialRotation = 0,
  initialPosition = { x: 0, y: 0 },
  slotDimensions = { width: 150, height: 220 }
}: UseStickerPositioningProps) => {
  const { activeShelfId, updateBook } = useBookshelfStore();
  const [scale, setScale] = useState<number>(initialScale);
  const [position2D, setPosition2D] = useState<Position2D>(initialPosition);
  const [rotation, setRotation] = useState<number>(initialRotation);
  
  useEffect(() => {
    const loadTransform = () => {
      const savedScale = localStorage.getItem(`slot-${activeShelfId}-${position}-scale`);
      if (savedScale) {
        setScale(parseFloat(savedScale));
      }
      
      const savedPositionX = localStorage.getItem(`slot-${activeShelfId}-${position}-position-x`);
      const savedPositionY = localStorage.getItem(`slot-${activeShelfId}-${position}-position-y`);
      if (savedPositionX && savedPositionY) {
        setPosition2D({
          x: parseFloat(savedPositionX),
          y: parseFloat(savedPositionY)
        });
      }
      
      const savedRotation = localStorage.getItem(`slot-${activeShelfId}-${position}-rotation`);
      if (savedRotation) {
        setRotation(parseFloat(savedRotation));
      }
    };
    
    loadTransform();
  }, [activeShelfId, position]);
  
  useEffect(() => {
    const saveTransform = () => {
      localStorage.setItem(`slot-${activeShelfId}-${position}-scale`, scale.toString());
      localStorage.setItem(`slot-${activeShelfId}-${position}-position-x`, position2D.x.toString());
      localStorage.setItem(`slot-${activeShelfId}-${position}-position-y`, position2D.y.toString());
      localStorage.setItem(`slot-${activeShelfId}-${position}-rotation`, rotation.toString());
    };
    
    saveTransform();
  }, [scale, position2D, rotation, activeShelfId, position]);
  
  const calculateBoundaries = useCallback((isAltKey: boolean = false) => {
    const stickerScale = scale || 1;
    const stickerWidth = slotDimensions.width * 0.8 * stickerScale;
    const stickerHeight = slotDimensions.height * 0.8 * stickerScale;
    
    let maxX = slotDimensions.width/2 - stickerWidth/4;
    let maxY = slotDimensions.height/2 - stickerHeight/4;
    let minX = -maxX;
    let minY = -maxY;
    
    if (isAltKey) {
      const extensionFactor = 0.2;
      maxX += slotDimensions.width * extensionFactor;
      maxY += slotDimensions.height * extensionFactor;
      minX -= slotDimensions.width * extensionFactor;
      minY -= slotDimensions.height * extensionFactor;
    }
    
    return { minX, maxX, minY, maxY };
  }, [scale, slotDimensions]);
  
  const clampPosition = useCallback((pos: Position2D, isAltKey: boolean = false) => {
    const { minX, maxX, minY, maxY } = calculateBoundaries(isAltKey);
    return {
      x: Math.max(minX, Math.min(maxX, pos.x)),
      y: Math.max(minY, Math.min(maxY, pos.y))
    };
  }, [calculateBoundaries]);
  
  const handleRotate = useCallback((direction: 'cw' | 'ccw') => {
    const rotationAmount = 15;
    setRotation(prev => direction === 'cw' ? prev + rotationAmount : prev - rotationAmount);
  }, []);
  
  const handleScaleChange = useCallback((newScale: number) => {
    if (newScale > 0 && newScale <= 3) {
      setScale(newScale);
    }
  }, []);
  
  const handleResetTransform = useCallback(() => {
    setScale(1);
    setPosition2D({ x: 0, y: 0 });
    setRotation(0);
    toast.success('Position, rotation, and scale reset');
  }, []);
  
  const clearTransformData = useCallback(() => {
    localStorage.removeItem(`slot-${activeShelfId}-${position}-scale`);
    localStorage.removeItem(`slot-${activeShelfId}-${position}-position-x`);
    localStorage.removeItem(`slot-${activeShelfId}-${position}-position-y`);
    localStorage.removeItem(`slot-${activeShelfId}-${position}-rotation`);
  }, [activeShelfId, position]);
  
  const applyTransformToBook = useCallback(() => {
    if (bookId) {
      updateBook(bookId, {
        scale,
        rotation,
        position2D: {
          x: position2D.x,
          y: position2D.y
        }
      });
    }
  }, [bookId, scale, rotation, position2D, updateBook]);

  return {
    scale,
    position2D,
    rotation,
    setScale,
    setPosition2D,
    setRotation,
    handleRotate,
    handleScaleChange,
    handleResetTransform,
    clampPosition,
    calculateBoundaries,
    clearTransformData,
    applyTransformToBook
  };
};
