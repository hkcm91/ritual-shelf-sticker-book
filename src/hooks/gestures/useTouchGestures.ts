
import { useCallback, useRef } from 'react';
import { useBookshelfStore } from '@/store/bookshelfStore';

/**
 * Custom hook to handle touch gestures with performance optimizations
 * - Single touch for panning
 * - Pinch to zoom
 */
export function useTouchGestures(
  scrollAreaRef: React.RefObject<HTMLElement>,
  updateDraggingState: (isDragging: boolean) => void,
  getScrollViewport: () => HTMLElement | undefined,
  inertiaRef: React.MutableRefObject<{ x: number; y: number }>,
  applyInertia: () => void
) {
  // Use refs instead of state to avoid re-renders and state update loops
  const initialDistanceRef = useRef(0);
  const initialZoomRef = useRef(1);
  const isZoomingRef = useRef(false);
  
  // For touch panning
  const startPointRef = useRef({ x: 0, y: 0 });
  const lastPointRef = useRef({ x: 0, y: 0 });
  const isTouchingRef = useRef(false);
  const lastTouchTimeRef = useRef(0);
  const touchThrottleMs = 16; // ~60fps
  
  // Access store only once per render and extract what we need
  const { zoomLevel, adjustZoomLevel, scrollPositionRef } = useBookshelfStore((state) => ({
    zoomLevel: state.zoomLevel,
    adjustZoomLevel: state.adjustZoomLevel,
    scrollPositionRef: state.scrollPositionRef
  }));

  // Handle touch start event
  const handleTouchStart = useCallback((e: TouchEvent) => {
    // Pinch gesture with two fingers
    if (e.touches.length === 2) {
      e.preventDefault();
      
      // Calculate distance between two touch points
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const distance = Math.hypot(dx, dy);
      
      // Store initial values in refs
      initialDistanceRef.current = distance;
      initialZoomRef.current = zoomLevel;
      isZoomingRef.current = true;
    } 
    // Single touch for panning
    else if (e.touches.length === 1) {
      updateDraggingState(true);
      isTouchingRef.current = true;
      
      const x = e.touches[0].clientX;
      const y = e.touches[0].clientY;
      
      // Store starting position in refs
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

  // Handle touch move event with throttling for better performance
  const handleTouchMove = useCallback((e: TouchEvent) => {
    // Throttle touch events for better performance
    const now = Date.now();
    if (now - lastTouchTimeRef.current < touchThrottleMs) return;
    lastTouchTimeRef.current = now;
    
    // Handle pinch-to-zoom with two fingers
    if (isZoomingRef.current && e.touches.length === 2) {
      e.preventDefault();
      
      // Calculate current distance between touch points
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const distance = Math.hypot(dx, dy);
      
      // Calculate zoom factor based on pinch gesture
      const scaleFactor = distance / initialDistanceRef.current;
      
      // Calculate target zoom level (with limits)
      const newZoom = Math.max(0.25, Math.min(2, initialZoomRef.current * scaleFactor));
      
      // Apply zoom change using a delta to avoid state loop
      const delta = newZoom - zoomLevel;
      
      // Only adjust if the change is significant enough
      if (Math.abs(delta) > 0.005) {
        adjustZoomLevel(delta);
      }
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
      
      // Apply scroll to the viewport element directly
      // This avoids React state updates and prevents loops
      const scrollViewport = getScrollViewport();
      if (scrollViewport) {
        scrollViewport.scrollLeft = scrollPositionRef.current.x + deltaX;
        scrollViewport.scrollTop = scrollPositionRef.current.y + deltaY;
      }
    }
  }, [getScrollViewport, inertiaRef, scrollPositionRef, zoomLevel, adjustZoomLevel]);

  // Handle touch end event
  const handleTouchEnd = useCallback(() => {
    // Reset zooming state
    isZoomingRef.current = false;
    
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
