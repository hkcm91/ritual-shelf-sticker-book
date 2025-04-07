
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

type UseTransformControlsProps = {
  activeShelfId: string;
  position: number;
};

export const useTransformControls = ({ activeShelfId, position }: UseTransformControlsProps) => {
  const [scale, setScale] = useState<number>(1);
  const [position2D, setPosition2D] = useState<{ x: number, y: number }>({ x: 0, y: 0 });
  const [rotation, setRotation] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number, y: number }>({ x: 0, y: 0 });
  
  // Load saved transform data
  useEffect(() => {
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
  }, [activeShelfId, position]);
  
  // Save transform data when they change
  useEffect(() => {
    localStorage.setItem(`slot-${activeShelfId}-${position}-scale`, scale.toString());
    localStorage.setItem(`slot-${activeShelfId}-${position}-position-x`, position2D.x.toString());
    localStorage.setItem(`slot-${activeShelfId}-${position}-position-y`, position2D.y.toString());
    localStorage.setItem(`slot-${activeShelfId}-${position}-rotation`, rotation.toString());
  }, [scale, position2D, rotation, activeShelfId, position]);
  
  // Handle rotation
  const handleRotate = (direction: 'cw' | 'ccw') => {
    const rotationAmount = 15; // degrees
    setRotation(prev => direction === 'cw' ? prev + rotationAmount : prev - rotationAmount);
  };
  
  // Handle scale change
  const handleScaleChange = (newScale: number) => {
    // Allow a wider range of scaling from 0.25x to 4x
    if (newScale >= 0.25 && newScale <= 4) {
      setScale(newScale);
    }
  };
  
  // Reset transform
  const handleResetTransform = () => {
    setScale(1);
    setPosition2D({ x: 0, y: 0 });
    setRotation(0);
    toast.success('Position, rotation, and scale reset');
  };
  
  // Clear transform data
  const clearTransformData = () => {
    localStorage.removeItem(`slot-${activeShelfId}-${position}-scale`);
    localStorage.removeItem(`slot-${activeShelfId}-${position}-position-x`);
    localStorage.removeItem(`slot-${activeShelfId}-${position}-position-y`);
    localStorage.removeItem(`slot-${activeShelfId}-${position}-rotation`);
  };

  return {
    scale,
    position2D,
    setPosition2D,
    rotation,
    isDragging,
    setIsDragging,
    dragStart,
    setDragStart,
    handleRotate,
    handleScaleChange,
    handleResetTransform,
    clearTransformData
  };
};
