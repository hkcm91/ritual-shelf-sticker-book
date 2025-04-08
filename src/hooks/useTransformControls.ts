
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

export interface TransformState {
  scale: number;
  position2D: { x: number, y: number };
  rotation: number;
}

export interface TransformControlsProps {
  activeShelfId: string;
  position: number;
  initialScale?: number;
  initialPosition?: { x: number, y: number };
  initialRotation?: number;
  onTransformChange?: (transform: TransformState) => void;
  min?: number;
  max?: number;
}

export const useTransformControls = ({
  activeShelfId,
  position,
  initialScale = 1,
  initialPosition = { x: 0, y: 0 },
  initialRotation = 0,
  onTransformChange,
  min = 0.1,
  max = 3
}: TransformControlsProps) => {
  const [scale, setScale] = useState<number>(initialScale);
  const [position2D, setPosition2D] = useState<{ x: number, y: number }>(initialPosition);
  const [rotation, setRotation] = useState<number>(initialRotation);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number, y: number }>({ x: 0, y: 0 });
  
  // Load saved transform data
  useEffect(() => {
    const loadTransform = () => {
      const storageKey = `slot-${activeShelfId}-${position}`;
      
      // Try to load saved transform data from localStorage
      try {
        const savedScale = localStorage.getItem(`${storageKey}-scale`);
        const savedPositionX = localStorage.getItem(`${storageKey}-position-x`);
        const savedPositionY = localStorage.getItem(`${storageKey}-position-y`);
        const savedRotation = localStorage.getItem(`${storageKey}-rotation`);
        
        if (savedScale) {
          setScale(parseFloat(savedScale));
        }
        
        if (savedPositionX && savedPositionY) {
          setPosition2D({
            x: parseFloat(savedPositionX),
            y: parseFloat(savedPositionY)
          });
        }
        
        if (savedRotation) {
          setRotation(parseFloat(savedRotation));
        }
      } catch (error) {
        console.error('Error loading transform data from localStorage:', error);
      }
    };
    
    loadTransform();
  }, [activeShelfId, position]);
  
  // Save transform data when they change
  useEffect(() => {
    const saveTransform = () => {
      const storageKey = `slot-${activeShelfId}-${position}`;
      
      try {
        localStorage.setItem(`${storageKey}-scale`, scale.toString());
        localStorage.setItem(`${storageKey}-position-x`, position2D.x.toString());
        localStorage.setItem(`${storageKey}-position-y`, position2D.y.toString());
        localStorage.setItem(`${storageKey}-rotation`, rotation.toString());
        
        // Call the callback if provided
        if (onTransformChange) {
          onTransformChange({ scale, position2D, rotation });
        }
      } catch (error) {
        console.error('Error saving transform data to localStorage:', error);
      }
    };
    
    saveTransform();
  }, [scale, position2D, rotation, activeShelfId, position, onTransformChange]);
  
  // Handle rotation
  const handleRotate = useCallback((direction: 'cw' | 'ccw') => {
    const rotationAmount = 15; // degrees
    setRotation(prev => {
      const newRotation = direction === 'cw' ? prev + rotationAmount : prev - rotationAmount;
      return newRotation;
    });
  }, []);
  
  // Handle scale change
  const handleScaleChange = useCallback((newScale: number) => {
    if (newScale >= min && newScale <= max) {
      setScale(newScale);
    } else if (newScale < min) {
      setScale(min);
    } else if (newScale > max) {
      setScale(max);
    }
  }, [min, max]);
  
  // Reset transform
  const handleResetTransform = useCallback(() => {
    setScale(initialScale);
    setPosition2D(initialPosition);
    setRotation(initialRotation);
    toast.success('Position, rotation, and scale reset');
  }, [initialScale, initialPosition, initialRotation]);
  
  // Clear transform data
  const clearTransformData = useCallback(() => {
    const storageKey = `slot-${activeShelfId}-${position}`;
    
    try {
      localStorage.removeItem(`${storageKey}-scale`);
      localStorage.removeItem(`${storageKey}-position-x`);
      localStorage.removeItem(`${storageKey}-position-y`);
      localStorage.removeItem(`${storageKey}-rotation`);
    } catch (error) {
      console.error('Error clearing transform data from localStorage:', error);
    }
  }, [activeShelfId, position]);

  // Helper to clamp position within boundaries
  const clampPosition = useCallback((x: number, y: number, boundaries: { 
    minX: number, 
    maxX: number, 
    minY: number, 
    maxY: number 
  }) => {
    return {
      x: Math.max(boundaries.minX, Math.min(boundaries.maxX, x)),
      y: Math.max(boundaries.minY, Math.min(boundaries.maxY, y))
    };
  }, []);

  return {
    // State
    scale,
    position2D,
    rotation,
    isDragging,
    dragStart,
    
    // Setters
    setScale,
    setPosition2D,
    setRotation,
    setIsDragging,
    setDragStart,
    
    // Handlers
    handleRotate,
    handleScaleChange,
    handleResetTransform,
    clearTransformData,
    clampPosition
  };
};

export default useTransformControls;
