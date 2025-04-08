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
  const { adjustZoomLevel } = useBookshelfStore();

  // Find the scrollable viewport element
  const getScrollViewport = () => {
    return scrollAreaRef.current?.querySelector('.scroll-area-viewport') as HTMLElement;
  };
  
  // Handle mouse wheel zoom on desktop
  const handleWheel = (e: WheelEvent) => {
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
  };

  return { handleWheel };
}
