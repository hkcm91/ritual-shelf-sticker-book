
import { useState, useCallback, MutableRefObject, useRef } from 'react';
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
  // For pinch-to-zoom
  const [touchState, setTouchState] = useState({
    initialDistance: 0,
    initialZoom: 1,
    isZooming: false,
  });
  
  // For touch panning
  const startPointRef = useRef({ x: 0, y: 0 });
  const lastPointRef = useRef({ x: 0, y: 0 });
  const isTouchingRef = useRef(false);
  
  // Get scroll position ref from store
  const scrollPositionRef = useBookshelfStore(state => state.scrollPositionRef) || { current: { x: 0, y: 0 } };
  
  // Access zoom level controls from store
  const { zoomLevel, setZoomLevel } = useBookshelfStore(state => ({
    zoomLevel: state.zoomLevel,
    setZoomLevel: state.setZoomLevel
  }));

  // Handle touch start event
  const handleTouchStart = useCallback((e: TouchEvent) => {
    // Pinch gesture with two fingers
    if (e.touches.length === 2) {
      e.preventDefault();
      
      // Calculate distance between two touch points
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      
      setTouchState({
        initialDistance: distance,
        initialZoom: zoomLevel,
        isZooming: true,
      });
    } 
    // Single touch for panning
    else if (e.touches.length === 1) {
      updateDraggingState(true);
      isTouchingRef.current = true;
      
      const x = e.touches[0].clientX;
      const y = e.touches[0].clientY;
      
      // Store starting position in refs to avoid re-renders
      startPointRef.current = { x, y };
      lastPointRef.current = { x, y };
      
      // Store current scroll position
      const scrollViewport = getScrollViewport();
      if (scrollViewport) {
        scrollPositionRef.current = {
          x: scrollViewport.scrollLeft,
          y: scrollViewport.scrollTop
        };
      }
    }
  }, [getScrollViewport, scrollPositionRef, updateDraggingState, zoomLevel]);

  // Handle touch move event
  const handleTouchMove = useCallback((e: TouchEvent) => {
    // Handle pinch-to-zoom with two fingers
    if (touchState.isZooming && e.touches.length === 2) {
      e.preventDefault();
      
      // Calculate current distance between touch points
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      
      // Calculate zoom factor based on pinch gesture
      const scaleFactor = distance / touchState.initialDistance;
      // Limit zoom to reasonable range (0.25x to 2x)
      const newZoom = Math.max(0.25, Math.min(2, touchState.initialZoom * scaleFactor));
      
      setZoomLevel(newZoom);
    } 
    // Handle panning with single finger
    else if (e.touches.length === 1 && isTouchingRef.current) {
      e.preventDefault();
      
      const x = e.touches[0].clientX;
      const y = e.touches[0].clientY;
      
      // Calculate delta from start position for absolute positioning
      const deltaX = startPointRef.current.x - x;
      const deltaY = startPointRef.current.y - y;
      
      // Calculate velocity for inertia effect
      inertiaRef.current = {
        x: lastPointRef.current.x - x,
        y: lastPointRef.current.y - y
      };
      
      // Update last position for next move calculation
      lastPointRef.current = { x, y };
      
      // Apply scroll to the viewport element
      const scrollViewport = getScrollViewport();
      if (scrollViewport) {
        scrollViewport.scrollLeft = scrollPositionRef.current.x + deltaX;
        scrollViewport.scrollTop = scrollPositionRef.current.y + deltaY;
      }
    }
  }, [getScrollViewport, inertiaRef, scrollPositionRef, touchState, setZoomLevel]);

  // Handle touch end event
  const handleTouchEnd = useCallback(() => {
    // Reset zooming state
    setTouchState({
      initialDistance: 0,
      initialZoom: 1,
      isZooming: false,
    });
    
    // Reset dragging state
    updateDraggingState(false);
    isTouchingRef.current = false;
    
    // Apply inertia if velocity is significant
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
