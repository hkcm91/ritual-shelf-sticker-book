
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { TransformState, TransformControlsProps, Position2D } from './transform/types';
import useTransformStorage from './transform/useTransformStorage';
import usePositionUtilities from './transform/usePositionUtilities';

export { TransformState, TransformControlsProps, Position2D };

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
  const [position2D, setPosition2D] = useState<Position2D>(initialPosition);
  const [rotation, setRotation] = useState<number>(initialRotation);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<Position2D>({ x: 0, y: 0 });
  
  const { loadTransformData, saveTransformData, clearTransformData } = useTransformStorage({ 
    activeShelfId, 
    position 
  });
  
  const { clampPosition } = usePositionUtilities();
  
  // Load saved transform data
  useEffect(() => {
    const savedData = loadTransformData();
    if (savedData.scale !== null) {
      setScale(savedData.scale);
    }
    
    if (savedData.position2D !== null) {
      setPosition2D(savedData.position2D);
    }
    
    if (savedData.rotation !== null) {
      setRotation(savedData.rotation);
    }
  }, [activeShelfId, position, loadTransformData]);
  
  // Save transform data when they change
  useEffect(() => {
    saveTransformData({ scale, position2D, rotation });
    
    // Call the callback if provided
    if (onTransformChange) {
      onTransformChange({ scale, position2D, rotation });
    }
  }, [scale, position2D, rotation, saveTransformData, onTransformChange]);
  
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
