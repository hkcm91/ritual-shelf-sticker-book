import { useEffect, useState, useRef } from 'react';
import { useBookshelfStore } from '@/store/bookshelfStore';

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
  const { zoomLevel, setZoomLevel, adjustZoomLevel } = useBookshelfStore();
  
  // For pinch-to-zoom on mobile
  const [touchState, setTouchState] = useState({
    initialDistance: 0,
    initialZoom: 1,
    isZooming: false,
  });
  
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
    
    const scrollElement = scrollAreaRef.current.querySelector('.scroll-area-viewport') as HTMLElement;
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

  // Handle pinch to zoom on mobile
  const handleTouchStart = (e: TouchEvent) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      
      setTouchState({
        initialDistance: distance,
        initialZoom: zoomLevel,
        isZooming: true,
      });
    } else if (e.touches.length === 1) {
      // Single touch for panning
      updateDraggingState(true);
      
      const x = e.touches[0].clientX;
      const y = e.touches[0].clientY;
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
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (touchState.isZooming && e.touches.length === 2) {
      e.preventDefault();
      
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      
      const scaleFactor = distance / touchState.initialDistance;
      const newZoom = Math.max(0.25, Math.min(2, touchState.initialZoom * scaleFactor));
      
      setZoomLevel(newZoom);
    } else if (isDraggingRef.current && e.touches.length === 1) {
      e.preventDefault();
      
      const x = e.touches[0].clientX;
      const y = e.touches[0].clientY;
      
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
      
      // Get scroll container and apply scroll
      const scrollViewport = getScrollViewport();
      if (scrollViewport) {
        scrollViewport.scrollLeft = scrollPositionRef.current.x + deltaX;
        scrollViewport.scrollTop = scrollPositionRef.current.y + deltaY;
      }
    }
  };

  const handleTouchEnd = () => {
    setTouchState({
      initialDistance: 0,
      initialZoom: 1,
      isZooming: false,
    });
    
    if (isDraggingRef.current) {
      updateDraggingState(false);
      
      // Start inertia effect if the velocity is significant
      if (Math.abs(inertiaRef.current.x) > 1 || Math.abs(inertiaRef.current.y) > 1) {
        rafRef.current = requestAnimationFrame(applyInertia);
      }
    }
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
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [containerRef, touchState, zoomLevel]);

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
