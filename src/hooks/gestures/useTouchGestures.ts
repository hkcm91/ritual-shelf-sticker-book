
import { useState } from 'react';
import { useBookshelfStore } from '@/store/bookshelfStore';

/**
 * Custom hook to handle touch gestures
 * - Pinch to zoom
 * - Touch drag to pan
 */
export function useTouchGestures(
  scrollAreaRef: React.RefObject<HTMLElement>,
  updateDraggingState: (isDragging: boolean) => void,
  getScrollViewport: () => HTMLElement | undefined,
  inertiaRef: React.MutableRefObject<{ x: number; y: number }>,
  applyInertia: () => void,
  setStartPoint: (point: { x: number; y: number }) => void,
  setLastPoint: (point: { x: number; y: number }) => void,
  scrollPositionRef: React.MutableRefObject<{ x: number; y: number }>
) {
  const { zoomLevel, setZoomLevel } = useBookshelfStore();
  
  // For pinch-to-zoom on mobile
  const [touchState, setTouchState] = useState({
    initialDistance: 0,
    initialZoom: 1,
    isZooming: false,
  });

  // Handle pinch to zoom on mobile
  const handleTouchStart = (e: TouchEvent) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      
      setTouchState({
        initialDistance: distance,
        initialZoom: zoomLevel,
        isZooming: true,
      });
    } else if (e.touches.length === 1) {
      // Single touch for panning
      updateDraggingState(true);
      
      const x = e.touches[0].clientX;
      const y = e.touches[0].clientY;
      setStartPoint({ x, y });
      setLastPoint({ x, y });
      
      // Store current scroll position
      const scrollViewport = getScrollViewport();
      if (scrollViewport) {
        scrollPositionRef.current = {
          x: scrollViewport.scrollLeft,
          y: scrollViewport.scrollTop
        };
      }
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (touchState.isZooming && e.touches.length === 2) {
      e.preventDefault();
      
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      
      const scaleFactor = distance / touchState.initialDistance;
      const newZoom = Math.max(0.25, Math.min(2, touchState.initialZoom * scaleFactor));
      
      setZoomLevel(newZoom);
    } else if (e.touches.length === 1) {
      e.preventDefault();
      
      const x = e.touches[0].clientX;
      const y = e.touches[0].clientY;
      
      // Calculate delta from start position
      const currentStartPoint = { x: parseInt(x.toString()), y: parseInt(y.toString()) };
      const deltaX = currentStartPoint.x - x;
      const deltaY = currentStartPoint.y - y;
      
      // Calculate velocity for inertia
      inertiaRef.current = {
        x: inertiaRef.current.x - x,
        y: inertiaRef.current.y - y
      };
      
      // Update last position for next move
      setLastPoint({ x, y });
      
      // Get scroll container and apply scroll
      const scrollViewport = getScrollViewport();
      if (scrollViewport) {
        scrollViewport.scrollLeft = scrollPositionRef.current.x + deltaX;
        scrollViewport.scrollTop = scrollPositionRef.current.y + deltaY;
      }
    }
  };

  const handleTouchEnd = () => {
    setTouchState({
      initialDistance: 0,
      initialZoom: 1,
      isZooming: false,
    });
    
    updateDraggingState(false);
    
    // Start inertia effect if the velocity is significant
    if (Math.abs(inertiaRef.current.x) > 1 || Math.abs(inertiaRef.current.y) > 1) {
      applyInertia();
    }
  };

  return {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    touchState
  };
}
