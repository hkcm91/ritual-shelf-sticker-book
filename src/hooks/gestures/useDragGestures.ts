
import { useState, useRef } from 'react';

/**
 * Custom hook to handle drag-to-pan functionality
 */
export function useDragGestures(
  scrollAreaRef: React.RefObject<HTMLElement>,
  setIsDragging?: (isDragging: boolean) => void
) {
  // For drag-to-pan functionality
  const isDraggingRef = useRef(false);
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
  const [lastPoint, setLastPoint] = useState({ x: 0, y: 0 });
  const scrollPositionRef = useRef({ x: 0, y: 0 });
  const inertiaRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);
  
  // Smoothly apply inertia after dragging
  const applyInertia = () => {
    if (!scrollAreaRef.current || Math.abs(inertiaRef.current.x) < 0.5 && Math.abs(inertiaRef.current.y) < 0.5) {
      rafRef.current = null;
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
    rafRef.current = requestAnimationFrame(applyInertia);
  };
  
  // Set isDragging state for UI feedback
  const updateDraggingState = (dragging: boolean) => {
    isDraggingRef.current = dragging;
    if (setIsDragging) {
      setIsDragging(dragging);
    }
  };

  // Find the scrollable viewport element
  const getScrollViewport = () => {
    return scrollAreaRef.current?.querySelector('.scroll-area-viewport') as HTMLElement;
  };

  // Handle mouse down for drag-to-pan
  const handleMouseDown = (e: MouseEvent) => {
    // Only allow pan with primary mouse button and no targets that need clicks
    if (e.button !== 0 || (e.target as HTMLElement).closest('button, a, input, [role="button"]')) {
      return;
    }
    
    updateDraggingState(true);
    
    const x = e.clientX;
    const y = e.clientY;
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
    
    // Cancel any ongoing inertia
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    
    // Prevent browser's default drag behavior
    e.preventDefault();
  };

  // Handle mouse move for dragging
  const handleMouseMove = (e: MouseEvent) => {
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
    const scrollViewport = getScrollViewport();
    if (scrollViewport) {
      scrollViewport.scrollLeft = scrollPositionRef.current.x + deltaX;
      scrollViewport.scrollTop = scrollPositionRef.current.y + deltaY;
    }
    
    // Prevent text selection during drag
    e.preventDefault();
  };

  // Handle mouse up to end dragging
  const handleMouseUp = () => {
    if (!isDraggingRef.current) return;
    
    updateDraggingState(false);
    
    // Start inertia effect if the velocity is significant
    if (Math.abs(inertiaRef.current.x) > 1 || Math.abs(inertiaRef.current.y) > 1) {
      rafRef.current = requestAnimationFrame(applyInertia);
    }
  };

  // Clean up any animations
  const cleanupAnimations = () => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  };

  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    getScrollViewport,
    cleanupAnimations,
    inertiaRef,
    isDraggingRef
  };
}
