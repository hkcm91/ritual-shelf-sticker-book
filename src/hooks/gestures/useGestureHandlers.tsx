
import { useEffect, useState, useRef } from 'react';
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
  // Set up drag gestures
  const {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    getScrollViewport,
    cleanupAnimations,
    inertiaRef,
    isDraggingRef
  } = useDragGestures(scrollAreaRef, setIsDragging);
  
  // Set up scroll gestures
  const { handleWheel } = useScrollGestures(scrollAreaRef);
  
  // Set up state for touch gestures
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
  const [lastPoint, setLastPoint] = useState({ x: 0, y: 0 });
  const scrollPositionRef = useRef({ x: 0, y: 0 });
  
  // Smoothly apply inertia after dragging
  const applyInertia = () => {
    if (!scrollAreaRef.current || Math.abs(inertiaRef.current.x) < 0.5 && Math.abs(inertiaRef.current.y) < 0.5) {
      return;
    }
    
    // Apply inertia with decay
    inertiaRef.current = {
      x: inertiaRef.current.x * 0.95,
      y: inertiaRef.current.y * 0.95
    };
    
    const scrollElement = getScrollViewport();
    if (scrollElement) {
      scrollElement.scrollBy(inertiaRef.current.x, inertiaRef.current.y);
    }
    
    // Continue animation
    requestAnimationFrame(applyInertia);
  };
  
  // Set isDragging state for UI feedback
  const updateDraggingState = (dragging: boolean) => {
    if (isDraggingRef) {
      isDraggingRef.current = dragging;
    }
    if (setIsDragging) {
      setIsDragging(dragging);
    }
  };

  // Set up touch gestures
  const {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd
  } = useTouchGestures(
    scrollAreaRef,
    updateDraggingState,
    getScrollViewport,
    inertiaRef,
    applyInertia,
    setStartPoint,
    setLastPoint,
    scrollPositionRef
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
  }, [containerRef]);

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
