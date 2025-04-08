import { useEffect, useState } from 'react';
import { useBookshelfStore } from '@/store/bookshelfStore';

interface GestureHandlers {
  handleTouchStart: (e: TouchEvent) => void;
  handleTouchMove: (e: TouchEvent) => void;
  handleTouchEnd: () => void;
  handleWheel: (e: WheelEvent) => void;
}

export function useGestureHandlers(containerRef: React.RefObject<HTMLElement>): GestureHandlers {
  const { zoomLevel, setZoomLevel, adjustZoomLevel } = useBookshelfStore();
  const [touchState, setTouchState] = useState({
    initialDistance: 0,
    initialZoom: 1,
    isZooming: false,
  });

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
    }
  };

  const handleTouchEnd = () => {
    setTouchState({
      initialDistance: 0,
      initialZoom: 1,
      isZooming: false,
    });
  };

  // Handle mouse wheel zoom on desktop
  const handleWheel = (e: WheelEvent) => {
    // If Alt key is pressed, use wheel for zooming
    if (e.altKey) {
      e.preventDefault();
      const delta = e.deltaY * -0.01;
      adjustZoomLevel(delta);
    }
    // Otherwise, allow normal scrolling (no need to prevent default)
  };

  // Set up event listeners
  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    element.addEventListener('touchstart', handleTouchStart, { passive: false });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd);
    element.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
      element.removeEventListener('wheel', handleWheel);
    };
  }, [containerRef, touchState, zoomLevel]);

  return {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleWheel
  };
}

export default useGestureHandlers;
