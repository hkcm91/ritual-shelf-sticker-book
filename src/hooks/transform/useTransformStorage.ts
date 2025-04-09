
import { useCallback } from 'react';
import { Position2D, TransformState } from './types';

interface UseTransformStorageProps {
  activeShelfId: string;
  position: number;
}

export const useTransformStorage = ({ activeShelfId, position }: UseTransformStorageProps) => {
  const storageKeyPrefix = `slot-${activeShelfId}-${position}`;
  
  const loadTransformData = useCallback(() => {
    try {
      const savedScale = localStorage.getItem(`${storageKeyPrefix}-scale`);
      const savedPositionX = localStorage.getItem(`${storageKeyPrefix}-position-x`);
      const savedPositionY = localStorage.getItem(`${storageKeyPrefix}-position-y`);
      const savedRotation = localStorage.getItem(`${storageKeyPrefix}-rotation`);
      
      return {
        scale: savedScale ? parseFloat(savedScale) : null,
        position2D: savedPositionX && savedPositionY ? {
          x: parseFloat(savedPositionX),
          y: parseFloat(savedPositionY)
        } : null,
        rotation: savedRotation ? parseFloat(savedRotation) : null
      };
    } catch (error) {
      console.error('Error loading transform data from localStorage:', error);
      return { scale: null, position2D: null, rotation: null };
    }
  }, [storageKeyPrefix]);
  
  const saveTransformData = useCallback((transform: TransformState) => {
    try {
      localStorage.setItem(`${storageKeyPrefix}-scale`, transform.scale.toString());
      localStorage.setItem(`${storageKeyPrefix}-position-x`, transform.position2D.x.toString());
      localStorage.setItem(`${storageKeyPrefix}-position-y`, transform.position2D.y.toString());
      localStorage.setItem(`${storageKeyPrefix}-rotation`, transform.rotation.toString());
      return true;
    } catch (error) {
      console.error('Error saving transform data to localStorage:', error);
      return false;
    }
  }, [storageKeyPrefix]);
  
  const clearTransformData = useCallback(() => {
    try {
      localStorage.removeItem(`${storageKeyPrefix}-scale`);
      localStorage.removeItem(`${storageKeyPrefix}-position-x`);
      localStorage.removeItem(`${storageKeyPrefix}-position-y`);
      localStorage.removeItem(`${storageKeyPrefix}-rotation`);
      return true;
    } catch (error) {
      console.error('Error clearing transform data from localStorage:', error);
      return false;
    }
  }, [storageKeyPrefix]);
  
  return {
    loadTransformData,
    saveTransformData,
    clearTransformData
  };
};

export default useTransformStorage;
