
import { useState, useRef, useCallback } from 'react';

export interface DragState {
  isDragging: boolean;
  startPoint: { x: number; y: number };
  lastPoint: { x: number; y: number };
  scrollPosition: { x: number; y: number };
  inertia: { x: number; y: number };
}

export interface DragHandlers {
  handleMouseDown: (e: MouseEvent) => void;
  handleMouseMove: (e: MouseEvent) => void;
  handleMouseUp: () => void;
  isDraggingRef: React.MutableRefObject<boolean>;
  inertiaRef: React.MutableRefObject<{ x: number; y: number }>;
  applyInertia: () => void;
  cleanupAnimations: () => void;
  getScrollElement: () => HTMLElement | undefined;
  
  // Add data transfer properties for drag and drop
  setDragData?: (data: string) => void;
  getDragData?: () => string | null;
}

export interface DragGesturesOptions {
  /**
   * Reference to the scrollable container element
   */
  scrollElementRef: React.RefObject<HTMLElement>;
  
  /**
   * Selector to find the scrollable element within the container
   * Default is '.scroll-area-viewport'
   */
  scrollElementSelector?: string;
  
  /**
   * Function to update dragging state in the UI
   */
  onDragStateChange?: (isDragging: boolean) => void;
  
  /**
   * Custom function to apply scrolling
   * If not provided, will use standard scrollLeft/scrollTop
   */
  onScroll?: (deltaX: number, deltaY: number) => void;
  
  /**
   * Allow dragging only on specified elements
   * If provided, dragging will only start on elements matching this selector
   */
  dragHandleSelector?: string;
  
  /**
   * Elements to exclude from triggering drag
   * Default is 'button, a, input, [role="button"]'
   */
  excludeSelector?: string;
  
  /**
   * Enable drag and drop functionality
   */
  enableDragDrop?: boolean;
  
  /**
   * Function called when item is dragged
   */
  onDragStart?: (e: MouseEvent) => void;
  
  /**
   * Function called when item is dropped
   */
  onDrop?: () => void;
}

/**
 * A reusable hook for implementing drag-to-pan functionality
 * Can be used in any component that needs dragging behavior
 */
export function useDragGestures({
  scrollElementRef,
  scrollElementSelector = '.scroll-area-viewport',
  onDragStateChange,
  onScroll,
  dragHandleSelector,
  excludeSelector = 'button, a, input, [role="button"]',
  enableDragDrop = false,
  onDragStart,
  onDrop
}: DragGesturesOptions): DragHandlers {
  // For drag-to-pan functionality
  const isDraggingRef = useRef(false);
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
  const [lastPoint, setLastPoint] = useState({ x: 0, y: 0 });
  const scrollPositionRef = useRef({ x: 0, y: 0 });
  const inertiaRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);
  
  // For drag and drop functionality
  const dragDataRef = useRef<string | null>(null);

  // Find the scrollable element
  const getScrollElement = useCallback(() => {
    if (!scrollElementRef.current) return undefined;
    
    if (scrollElementSelector) {
      return scrollElementRef.current.querySelector(scrollElementSelector) as HTMLElement || scrollElementRef.current;
    }
    
    return scrollElementRef.current;
  }, [scrollElementRef, scrollElementSelector]);
  
  // Set isDragging state for UI feedback
  const updateDraggingState = useCallback((dragging: boolean) => {
    isDraggingRef.current = dragging;
    if (onDragStateChange) {
      onDragStateChange(dragging);
    }
  }, [onDragStateChange]);
  
  // Set drag data for drag and drop operations
  const setDragData = useCallback((data: string) => {
    dragDataRef.current = data;
  }, []);
  
  // Get drag data for drop operations
  const getDragData = useCallback(() => {
    return dragDataRef.current;
  }, []);
  
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
    
    // Call the onDragStart callback if provided
    if (enableDragDrop && onDragStart) {
      onDragStart(e);
    }
    
    // Cancel any ongoing inertia
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    
    // Prevent browser's default drag behavior
    e.preventDefault();
  }, [updateDraggingState, getScrollElement, dragHandleSelector, excludeSelector, enableDragDrop, onDragStart]);

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
    
    // If drag and drop is enabled, we don't scroll
    if (!enableDragDrop) {
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
    }
    
    // Prevent text selection during drag
    e.preventDefault();
  }, [startPoint, lastPoint, getScrollElement, onScroll, enableDragDrop]);

  // Handle mouse up to end dragging
  const handleMouseUp = useCallback(() => {
    if (!isDraggingRef.current) return;
    
    updateDraggingState(false);
    
    // Call onDrop if drag and drop is enabled
    if (enableDragDrop && onDrop) {
      onDrop();
    } else {
      // Start inertia effect if the velocity is significant
      if (Math.abs(inertiaRef.current.x) > 1 || Math.abs(inertiaRef.current.y) > 1) {
        rafRef.current = requestAnimationFrame(applyInertia);
      }
    }
    
    // Clear drag data
    if (enableDragDrop) {
      dragDataRef.current = null;
    }
  }, [updateDraggingState, applyInertia, enableDragDrop, onDrop]);

  // Clean up any animations
  const cleanupAnimations = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    isDraggingRef,
    inertiaRef,
    applyInertia,
    cleanupAnimations,
    getScrollElement,
    // Only include drag and drop methods if enabled
    ...(enableDragDrop ? { setDragData, getDragData } : {})
  };
}
