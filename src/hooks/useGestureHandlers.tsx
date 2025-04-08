import { useEffect, useState, useRef } from 'react';
import { useBookshelfStore } from '@/store/bookshelfStore';

interface GestureHandlers {
  handleTouchStart: (e: TouchEvent) => void;
  handleTouchMove: (e: TouchEvent) => void;
  handleTouchEnd: () => void;
  handleWheel: (e: WheelEvent) => void;
  handleMouseDown: (e: MouseEvent) => void;
  handleMouseMove: (e: MouseEvent) => void;
  handleMouseUp: () => void;
}

export function useGestureHandlers(containerRef: React.RefObject<HTMLElement>): GestureHandlers {
  const { zoomLevel, setZoomLevel, adjustZoomLevel } = useBookshelfStore();
  const [touchState, setTouchState] = useState({
    initialDistance: 0,
    initialZoom: 1,
    isZooming: false,
  });
  
  // For drag-to-pan functionality
  const [isDragging, setIsDragging] = useState(false);
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
  const scrollPositionRef = useRef({ x: 0, y: 0 });

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
      setIsDragging(true);
      setStartPoint({ 
        x: e.touches[0].clientX, 
        y: e.touches[0].clientY 
      });
      
      // Store current scroll position
      const scrollContainer = containerRef.current?.closest('.scrollbar-thumb') as HTMLElement;
      if (scrollContainer) {
        scrollPositionRef.current = {
          x: scrollContainer.scrollLeft,
          y: scrollContainer.scrollTop
        };
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
    } else if (isDragging && e.touches.length === 1) {
      e.preventDefault();
      
      // Calculate movement
      const deltaX = startPoint.x - e.touches[0].clientX;
      const deltaY = startPoint.y - e.touches[0].clientY;
      
      // Get scroll container
      const scrollAreaViewport = containerRef.current?.closest('.scroll-area-viewport') as HTMLElement;
      if (scrollAreaViewport) {
        scrollAreaViewport.scrollLeft = scrollPositionRef.current.x + deltaX;
        scrollAreaViewport.scrollTop = scrollPositionRef.current.y + deltaY;
      }
    }
  };

  const handleTouchEnd = () => {
    setTouchState({
      initialDistance: 0,
      initialZoom: 1,
      isZooming: false,
    });
    setIsDragging(false);
  };

  // Handle mouse wheel zoom on desktop
  const handleWheel = (e: WheelEvent) => {
    // If Alt key is pressed, use wheel for zooming
    if (e.altKey) {
      e.preventDefault();
      const delta = e.deltaY * -0.01;
      adjustZoomLevel(delta);
    } 
    // Use shift+wheel for horizontal scrolling
    else if (e.shiftKey) {
      e.preventDefault();
      const scrollAreaViewport = containerRef.current?.closest('.scroll-area-viewport') as HTMLElement;
      if (scrollAreaViewport) {
        scrollAreaViewport.scrollLeft += e.deltaY;
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
    
    setIsDragging(true);
    setStartPoint({ x: e.clientX, y: e.clientY });
    
    // Store current scroll position
    const scrollAreaViewport = containerRef.current?.closest('.scroll-area-viewport') as HTMLElement;
    if (scrollAreaViewport) {
      scrollPositionRef.current = {
        x: scrollAreaViewport.scrollLeft,
        y: scrollAreaViewport.scrollTop
      };
    }
    
    // Prevent browser's default drag behavior
    e.preventDefault();
  };

  // Handle mouse move for dragging
  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    
    // Calculate movement
    const deltaX = startPoint.x - e.clientX;
    const deltaY = startPoint.y - e.clientY;
    
    // Apply scrolling
    const scrollAreaViewport = containerRef.current?.closest('.scroll-area-viewport') as HTMLElement;
    if (scrollAreaViewport) {
      scrollAreaViewport.scrollLeft = scrollPositionRef.current.x + deltaX;
      scrollAreaViewport.scrollTop = scrollPositionRef.current.y + deltaY;
    }
    
    // Prevent text selection during drag
    e.preventDefault();
  };

  // Handle mouse up to end dragging
  const handleMouseUp = () => {
    setIsDragging(false);
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

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
      element.removeEventListener('wheel', handleWheel);
      element.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [containerRef, touchState, zoomLevel, isDragging, startPoint]);

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
