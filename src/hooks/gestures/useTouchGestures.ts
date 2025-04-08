
import { useState, useCallback, MutableRefObject } from 'react';
import { useBookshelfStore } from '@/store/bookshelfStore';

/**
 * Custom hook to handle touch gestures
 * - Single touch for panning
 * - Pinch to zoom
 */
export function useTouchGestures(
  scrollAreaRef: React.RefObject<HTMLElement>,
  updateDraggingState: (isDragging: boolean) => void,
  getScrollViewport: () => HTMLElement | undefined,
  inertiaRef: MutableRefObject<{ x: number; y: number }>,
  applyInertia: () => void
) {
  const [touchState, setTouchState] = useState({
    initialDistance: 0,
    initialZoom: 1,
    isZooming: false,
  });
  
  // For touch panning
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
  const [lastPoint, setLastPoint] = useState({ x: 0, y: 0 });
  const scrollPositionRef = useBookshelfStore.getState().scrollPositionRef || { current: { x: 0, y: 0 } };
  
  // Directly destructure from the hook
  const adjustZoomLevel = useBookshelfStore(state => state.adjustZoomLevel);
  const zoomLevel = useBookshelfStore(state => state.zoomLevel);
  const setZoomLevel = useBookshelfStore(state => state.setZoomLevel);

  // Handle pinch to zoom on mobile
  const handleTouchStart = useCallback((e: TouchEvent) => {
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
  }, [getScrollViewport, scrollPositionRef, setLastPoint, setStartPoint, updateDraggingState, zoomLevel]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
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
      const deltaX = startPoint.x - x;
      const deltaY = startPoint.y - y;
      
      // Calculate velocity for inertia
      inertiaRef.current = {
        x: lastPoint.x - x,
        y: lastPoint.y - y
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
  }, [getScrollViewport, inertiaRef, scrollPositionRef, setLastPoint, setZoomLevel, startPoint, touchState, lastPoint]);

  const handleTouchEnd = useCallback(() => {
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
  }, [applyInertia, inertiaRef, updateDraggingState]);

  return {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd
  };
}
