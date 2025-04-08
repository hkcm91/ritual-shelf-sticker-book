
import { useEffect } from 'react';
import { useDragGestures } from './useDragGestures';
import { useScrollGestures } from './useScrollGestures';
import { useTouchGestures } from './useTouchGestures';

/**
 * Custom hook to handle various gestures for the bookshelf
 * - Mouse wheel scrolling (with Shift for horizontal)
 * - Alt+wheel for zooming
 * - Mouse drag to pan
 * - Touch gestures (pinch to zoom, drag to pan)
 */
export function useGestureHandlers(
  containerRef: React.RefObject<HTMLElement>,
  scrollAreaRef: React.RefObject<HTMLElement>,
  setIsDragging?: (isDragging: boolean) => void
) {
  // Set up drag gestures using our reusable hook
  const {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    isDraggingRef,
    inertiaRef,
    applyInertia,
    cleanupAnimations,
    getScrollElement
  } = useDragGestures({
    scrollElementRef: scrollAreaRef,
    scrollElementSelector: '.scroll-area-viewport',
    onDragStateChange: setIsDragging,
    excludeSelector: 'button, a, input, [role="button"], .book-cover, .book'
  });
  
  // Set up scroll gestures
  const { handleWheel, getScrollViewport } = useScrollGestures(scrollAreaRef);
  
  // Set isDragging state for UI feedback
  const updateDraggingState = (dragging: boolean) => {
    if (isDraggingRef) {
      isDraggingRef.current = dragging;
    }
    if (setIsDragging) {
      setIsDragging(dragging);
    }
  };

  // Set up touch gestures using our touch handler hook
  const {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd
  } = useTouchGestures(
    scrollAreaRef,
    updateDraggingState,
    getScrollViewport || getScrollElement,
    inertiaRef,
    applyInertia
  );

  // Set up event listeners
  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    element.addEventListener('touchstart', handleTouchStart, { passive: false });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd);
    element.addEventListener('wheel', handleWheel, { passive: false });
    element.addEventListener('mousedown', handleMouseDown);
    
    // Add mouse move and up to window to capture events outside the element
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mouseleave', handleMouseUp); // Handle when mouse leaves window

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
      element.removeEventListener('wheel', handleWheel);
      element.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseleave', handleMouseUp);
      
      // Cancel any animations on cleanup
      cleanupAnimations();
    };
  }, [
    containerRef, 
    handleTouchStart, 
    handleTouchMove, 
    handleTouchEnd, 
    handleWheel, 
    handleMouseDown, 
    handleMouseMove, 
    handleMouseUp, 
    cleanupAnimations
  ]);

  return {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleWheel,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp
  };
}

export default useGestureHandlers;
