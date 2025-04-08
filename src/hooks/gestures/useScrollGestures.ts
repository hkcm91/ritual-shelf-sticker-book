import { useCallback, useRef } from 'react';
import { useBookshelfStore } from '@/store/bookshelfStore';

/**
 * Custom hook to handle mouse wheel scrolling with improved zoom-to-cursor
 * - Normal scroll for vertical
 * - Shift+scroll for horizontal
 * - Alt+scroll for zooming toward cursor position
 */
export function useScrollGestures(
  scrollAreaRef: React.RefObject<HTMLElement>
) {
  // Get store values and functions
  const { zoomLevel, adjustZoomLevel } = useBookshelfStore(state => ({
    zoomLevel: state.zoomLevel,
    adjustZoomLevel: state.adjustZoomLevel
  }));
  
  // Use a ref to track last wheel event timestamp for throttling
  const lastWheelTime = useRef(0);
  const wheelThrottleMs = 16; // ~60fps

  // Find the scrollable viewport element
  const getScrollViewport = useCallback(() => {
    if (!scrollAreaRef.current) return undefined;
    return scrollAreaRef.current.querySelector('.scroll-area-viewport') as HTMLElement;
  }, [scrollAreaRef]);
  
  // Handle mouse wheel zoom on desktop with zoom-to-cursor
  const handleWheel = useCallback((e: WheelEvent) => {
    // Throttle wheel events for better performance
    const now = Date.now();
    if (now - lastWheelTime.current < wheelThrottleMs) return;
    lastWheelTime.current = now;
    
    // If Alt key is pressed, use wheel for zooming
    if (e.altKey) {
      e.preventDefault();
      
      const scrollViewport = getScrollViewport();
      if (!scrollViewport) return;
      
      // Get cursor position relative to the viewport
      const rect = scrollViewport.getBoundingClientRect();
      const cursorX = e.clientX - rect.left + scrollViewport.scrollLeft;
      const cursorY = e.clientY - rect.top + scrollViewport.scrollTop;
      
      // Calculate zoom delta (smoother zoom)
      const delta = e.deltaY * -0.001;
      
      // Calculate old and new scale
      const oldScale = zoomLevel;
      const newScale = Math.max(0.25, Math.min(2, oldScale + delta));
      
      // Only proceed if scale actually changed
      if (newScale !== oldScale) {
        // Ratio of new scale to old scale
        const scaleFactor = newScale / oldScale;
        
        // Calculate new scroll position to zoom toward cursor
        const newScrollX = cursorX * scaleFactor - (e.clientX - rect.left) + scrollViewport.scrollLeft;
        const newScrollY = cursorY * scaleFactor - (e.clientY - rect.top) + scrollViewport.scrollTop;
        
        // Apply new zoom level
        requestAnimationFrame(() => {
          // Update the zoom level in the store
          adjustZoomLevel(delta);
          
          // Adjust scroll position to keep cursor point fixed
          scrollViewport.scrollLeft = newScrollX;
          scrollViewport.scrollTop = newScrollY;
        });
      }
    } 
    // Use shift+wheel for horizontal scrolling
    else if (e.shiftKey) {
      e.preventDefault();
      const scrollViewport = getScrollViewport();
      if (scrollViewport) {
        scrollViewport.scrollLeft += e.deltaY;
      }
    }
    // Otherwise, allow normal vertical scrolling (no need to prevent default)
  }, [adjustZoomLevel, getScrollViewport, zoomLevel]);

  return { handleWheel, getScrollViewport };
}
