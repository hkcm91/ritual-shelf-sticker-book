
import { useCallback } from 'react';
import { useBookshelfStore } from '@/store/bookshelfStore';

/**
 * Custom hook to handle mouse wheel scrolling
 * - Normal scroll for vertical
 * - Shift+scroll for horizontal
 * - Alt+scroll for zooming
 */
export function useScrollGestures(
  scrollAreaRef: React.RefObject<HTMLElement>
) {
  // Directly get the adjust function from the store
  const adjustZoomLevel = useBookshelfStore(state => state.adjustZoomLevel);

  // Find the scrollable viewport element
  const getScrollViewport = useCallback(() => {
    if (!scrollAreaRef.current) return undefined;
    return scrollAreaRef.current.querySelector('.scroll-area-viewport') as HTMLElement;
  }, [scrollAreaRef]);
  
  // Handle mouse wheel zoom on desktop
  const handleWheel = useCallback((e: WheelEvent) => {
    // If Alt key is pressed, use wheel for zooming
    if (e.altKey) {
      e.preventDefault();
      const delta = e.deltaY * -0.001; // Smoother zoom
      adjustZoomLevel(delta);
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
  }, [adjustZoomLevel, getScrollViewport]);

  return { handleWheel, getScrollViewport };
}
