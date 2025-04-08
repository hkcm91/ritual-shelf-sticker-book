
import { useEffect } from 'react';
import { useDragGestures } from './useDragGestures';
import { useScrollGestures } from './useScrollGestures';
import { useTouchGestures } from './useTouchGestures';

/**
 * Custom hook to handle various gestures for the bookshelf
 * - Mouse wheel scrolling (with Shift for horizontal)
 * - Alt+wheel for zooming toward cursor
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
  
  // Set up scroll gestures with zoom-to-cursor
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

  // Set up touch gestures with pinch-to-zoom
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

  // Set up event listeners with { passive: false } for preventDefault()
  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    // Add touch event listeners with passive: false to allow preventDefault
    element.addEventListener('touchstart', handleTouchStart, { passive: false });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd);
    
    // Add wheel event with passive: false to allow preventDefault for alt+wheel
    element.addEventListener('wheel', handleWheel, { passive: false });
    
    // Add mouse events for dragging
    element.addEventListener('mousedown', handleMouseDown);
    
    // Add mouse move and up to window to capture events outside the element
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mouseleave', handleMouseUp); // Handle when mouse leaves window

    return () => {
      // Clean up all event listeners
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
