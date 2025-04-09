
import { useCallback } from 'react';
import { Position2D, TransformBoundaries } from './types';

export const usePositionUtilities = () => {
  // Helper to clamp position within boundaries
  const clampPosition = useCallback((position: Position2D, boundaries: TransformBoundaries): Position2D => {
    return {
      x: Math.max(boundaries.minX, Math.min(boundaries.maxX, position.x)),
      y: Math.max(boundaries.minY, Math.min(boundaries.maxY, position.y))
    };
  }, []);

  // Calculate boundaries for positioning
  const calculateBoundaries = useCallback((
    containerSize: { width: number, height: number },
    scale: number = 1,
    isExtended: boolean = false
  ): TransformBoundaries => {
    const stickerWidth = containerSize.width * 0.8 * scale;
    const stickerHeight = containerSize.height * 0.8 * scale;
    
    let maxX = containerSize.width/2 - stickerWidth/4;
    let maxY = containerSize.height/2 - stickerHeight/4;
    let minX = -maxX;
    let minY = -maxY;
    
    // If extended boundaries are requested (e.g., for Alt-key dragging)
    if (isExtended) {
      const extensionFactor = 0.2;
      maxX += containerSize.width * extensionFactor;
      maxY += containerSize.height * extensionFactor;
      minX -= containerSize.width * extensionFactor;
      minY -= containerSize.height * extensionFactor;
    }
    
    return { minX, maxX, minY, maxY };
  }, []);

  return {
    clampPosition,
    calculateBoundaries
  };
};

export default usePositionUtilities;
