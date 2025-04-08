
import { useState, useRef, useCallback } from 'react';
import { DragGesturesOptions, DragHandlers } from './types';
import { useInertia } from './useInertia';

/**
 * A reusable hook for implementing drag-to-pan functionality
 * Core functionality extracted from the original useDragGestures hook
 */
export function useCoreDragGestures({
  scrollElementRef,
  scrollElementSelector = '.scroll-area-viewport',
  onDragStateChange,
  onScroll,
  dragHandleSelector,
  excludeSelector = 'button, a, input, [role="button"]'
}: DragGesturesOptions): DragHandlers {
  // For drag-to-pan functionality
  const isDraggingRef = useRef(false);
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
  const [lastPoint, setLastPoint] = useState({ x: 0, y: 0 });
  const scrollPositionRef = useRef({ x: 0, y: 0 });
  
  // Find the scrollable element
  const getScrollElement = useCallback(() => {
    if (!scrollElementRef.current) return undefined;
    
    if (scrollElementSelector) {
      return scrollElementRef.current.querySelector(scrollElementSelector) as HTMLElement || scrollElementRef.current;
    }
    
    return scrollElementRef.current;
  }, [scrollElementRef, scrollElementSelector]);
  
  // Get inertia functionality
  const { inertiaRef, rafRef, applyInertia, cleanupAnimations } = useInertia(
    scrollElementRef, 
    getScrollElement, 
    onScroll
  );
  
  // Set isDragging state for UI feedback
  const updateDraggingState = useCallback((dragging: boolean) => {
    isDraggingRef.current = dragging;
    if (onDragStateChange) {
      onDragStateChange(dragging);
    }
  }, [onDragStateChange]);

  // Handle mouse down for drag-to-pan
  const handleMouseDown = useCallback((e: MouseEvent) => {
    // Only allow pan with primary mouse button
    if (e.button !== 0) return;
    
    // Check if clicking on a handle element (if specified)
    if (dragHandleSelector) {
      const isHandle = (e.target as HTMLElement).closest(dragHandleSelector);
      if (!isHandle) return;
    }
    
    // Don't drag if clicking on interactive elements
    if ((e.target as HTMLElement).closest(excludeSelector)) {
      return;
    }
    
    updateDraggingState(true);
    
    const x = e.clientX;
    const y = e.clientY;
    setStartPoint({ x, y });
    setLastPoint({ x, y });
    
    // Store current scroll position
    const scrollElement = getScrollElement();
    if (scrollElement) {
      scrollPositionRef.current = {
        x: scrollElement.scrollLeft,
        y: scrollElement.scrollTop
      };
    }
    
    // Cancel any ongoing inertia
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    
    // Prevent browser's default drag behavior
    e.preventDefault();
  }, [updateDraggingState, getScrollElement, dragHandleSelector, excludeSelector, rafRef]);

  // Handle mouse move for dragging
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDraggingRef.current) return;
    
    const x = e.clientX;
    const y = e.clientY;
    
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
    
    // Apply scrolling
    const scrollElement = getScrollElement();
    if (scrollElement) {
      if (onScroll) {
        onScroll(deltaX, deltaY);
      } else {
        scrollElement.scrollLeft = scrollPositionRef.current.x + deltaX;
        scrollElement.scrollTop = scrollPositionRef.current.y + deltaY;
      }
    }
    
    // Prevent text selection during drag
    e.preventDefault();
  }, [startPoint, getScrollElement, onScroll, inertiaRef]);

  // Handle mouse up to end dragging
  const handleMouseUp = useCallback(() => {
    if (!isDraggingRef.current) return;
    
    updateDraggingState(false);
    
    // Start inertia effect if the velocity is significant
    if (Math.abs(inertiaRef.current.x) > 1 || Math.abs(inertiaRef.current.y) > 1) {
      rafRef.current = requestAnimationFrame(applyInertia);
    }
  }, [updateDraggingState, applyInertia, inertiaRef, rafRef]);

  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    isDraggingRef,
    inertiaRef,
    applyInertia,
    cleanupAnimations,
    getScrollElement
  };
}
