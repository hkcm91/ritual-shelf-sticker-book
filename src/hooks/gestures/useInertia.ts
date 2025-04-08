
import { useRef, useCallback } from 'react';

/**
 * Hook to handle inertia scrolling after drag
 */
export function useInertia(
  scrollElementRef: React.RefObject<HTMLElement>,
  getScrollElement: () => HTMLElement | undefined,
  onScroll?: (deltaX: number, deltaY: number) => void
) {
  const inertiaRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);
  
  // Smoothly apply inertia after dragging
  const applyInertia = useCallback(() => {
    if (!scrollElementRef.current || Math.abs(inertiaRef.current.x) < 0.5 && Math.abs(inertiaRef.current.y) < 0.5) {
      rafRef.current = null;
      return;
    }
    
    // Apply inertia with decay
    inertiaRef.current = {
      x: inertiaRef.current.x * 0.95,
      y: inertiaRef.current.y * 0.95
    };
    
    const scrollElement = getScrollElement();
    if (scrollElement) {
      if (onScroll) {
        onScroll(inertiaRef.current.x, inertiaRef.current.y);
      } else {
        scrollElement.scrollBy(inertiaRef.current.x, inertiaRef.current.y);
      }
    }
    
    // Continue animation
    rafRef.current = requestAnimationFrame(applyInertia);
  }, [scrollElementRef, getScrollElement, onScroll]);

  // Clean up any animations
  const cleanupAnimations = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  return {
    inertiaRef,
    rafRef,
    applyInertia,
    cleanupAnimations
  };
}
