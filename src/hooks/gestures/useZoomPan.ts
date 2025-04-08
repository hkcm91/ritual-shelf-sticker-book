
import { useCallback, useEffect, useRef, useState } from 'react';

interface ZoomPanOptions {
  minScale?: number;
  maxScale?: number;
  scaleStep?: number;
  transformOrigin?: string;
  disableWheel?: boolean;
  disableTouch?: boolean;
  disableDrag?: boolean;
  altZoomMultiplier?: number;
}

/**
 * Hook for adding zoom and pan functionality to a container
 */
export function useZoomPan(
  containerRef: React.RefObject<HTMLElement>,
  {
    minScale = 0.25,
    maxScale = 3,
    scaleStep = 0.1,
    transformOrigin = 'top left',
    disableWheel = false,
    disableTouch = false,
    disableDrag = false,
    altZoomMultiplier = 2.5,
  }: ZoomPanOptions = {}
) {
  // State for transform values
  const [scale, setScale] = useState(1);
  const [translateX, setTranslateX] = useState(0);
  const [translateY, setTranslateY] = useState(0);

  // Refs for internal tracking
  const isDraggingRef = useRef(false);
  const lastPointRef = useRef({ x: 0, y: 0 });
  const initialTouchDistanceRef = useRef(0);
  const initialScaleRef = useRef(1);
  const isPinchingRef = useRef(false);
  const pinchCenterRef = useRef({ x: 0, y: 0 });

  // Apply transforms to container using CSS variables
  const applyTransform = useCallback(() => {
    if (!containerRef.current) return;
    
    containerRef.current.style.setProperty('--scale', scale.toString());
    containerRef.current.style.setProperty('--translateX', `${translateX}px`);
    containerRef.current.style.setProperty('--translateY', `${translateY}px`);
  }, [containerRef, scale, translateX, translateY]);

  // Update transform whenever state changes
  useEffect(() => {
    applyTransform();
  }, [applyTransform, scale, translateX, translateY]);

  // Zoom towards a specific point (mouse position or pinch center)
  const zoomTowardsPoint = useCallback(
    (point: { x: number; y: number }, newScale: number) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const offsetX = point.x - rect.left;
      const offsetY = point.y - rect.top;
      
      // Calculate new position to zoom towards cursor
      const scaleRatio = newScale / scale;
      const newTranslateX = offsetX - (offsetX - translateX) * scaleRatio;
      const newTranslateY = offsetY - (offsetY - translateY) * scaleRatio;
      
      setScale(newScale);
      setTranslateX(newTranslateX);
      setTranslateY(newTranslateY);
    },
    [containerRef, scale, translateX, translateY]
  );

  // Reset transform to initial values
  const resetTransform = useCallback(() => {
    setScale(1);
    setTranslateX(0);
    setTranslateY(0);
  }, []);

  // Set transform directly
  const setTransform = useCallback((transform: {
    scale?: number;
    translateX?: number;
    translateY?: number;
  }) => {
    if (transform.scale !== undefined) {
      setScale(Math.min(maxScale, Math.max(minScale, transform.scale)));
    }
    
    if (transform.translateX !== undefined) {
      setTranslateX(transform.translateX);
    }
    
    if (transform.translateY !== undefined) {
      setTranslateY(transform.translateY);
    }
  }, [maxScale, minScale]);

  // Wheel event handler for zooming
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      if (disableWheel) return;
      
      // Use Alt+wheel for zooming, normal wheel for scrolling
      if (e.altKey) {
        e.preventDefault();
        
        // Calculate zoom amount based on wheel delta
        const delta = -Math.sign(e.deltaY) * scaleStep * altZoomMultiplier;
        const newScale = Math.min(maxScale, Math.max(minScale, scale + delta));
        
        // Zoom towards cursor position
        zoomTowardsPoint({ x: e.clientX, y: e.clientY }, newScale);
      }
    },
    [altZoomMultiplier, disableWheel, maxScale, minScale, scale, scaleStep, zoomTowardsPoint]
  );

  // Mouse handlers for dragging/panning
  const handleMouseDown = useCallback(
    (e: MouseEvent) => {
      if (disableDrag) return;
      
      // Only handle primary mouse button and ignore clicks on interactive elements
      if (e.button !== 0 || 
          (e.target as HTMLElement).closest('button, a, input, [role="button"], .book-cover, .book')) {
        return;
      }
      
      e.preventDefault();
      isDraggingRef.current = true;
      lastPointRef.current = { x: e.clientX, y: e.clientY };
      
      // Add 'is-dragging' class for cursor changes
      containerRef.current?.classList.add('is-dragging');
    },
    [containerRef, disableDrag]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      
      e.preventDefault();
      
      // Calculate movement delta
      const deltaX = e.clientX - lastPointRef.current.x;
      const deltaY = e.clientY - lastPointRef.current.y;
      
      // Update position
      setTranslateX(prev => prev + deltaX);
      setTranslateY(prev => prev + deltaY);
      
      // Update last point
      lastPointRef.current = { x: e.clientX, y: e.clientY };
    },
    []
  );

  const handleMouseUp = useCallback(() => {
    if (!isDraggingRef.current) return;
    
    isDraggingRef.current = false;
    containerRef.current?.classList.remove('is-dragging');
  }, [containerRef]);

  // Touch handlers for mobile
  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      if (disableTouch) return;
      
      if (e.touches.length === 2) {
        // Pinch to zoom gesture starting
        e.preventDefault();
        isPinchingRef.current = true;
        
        // Calculate initial distance between touch points
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        initialTouchDistanceRef.current = Math.hypot(
          touch1.clientX - touch2.clientX,
          touch1.clientY - touch2.clientY
        );
        
        // Store the current scale as reference
        initialScaleRef.current = scale;
        
        // Calculate pinch center point
        pinchCenterRef.current = {
          x: (touch1.clientX + touch2.clientX) / 2,
          y: (touch1.clientY + touch2.clientY) / 2
        };
      } 
      else if (e.touches.length === 1) {
        // Single touch for panning
        if ((e.target as HTMLElement).closest('button, a, input, [role="button"], .book-cover, .book')) {
          return;
        }
        
        e.preventDefault();
        isDraggingRef.current = true;
        lastPointRef.current = { 
          x: e.touches[0].clientX, 
          y: e.touches[0].clientY 
        };
        
        // Add dragging class
        containerRef.current?.classList.add('is-dragging');
      }
    },
    [containerRef, disableTouch, scale]
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (disableTouch) return;
      
      if (isPinchingRef.current && e.touches.length === 2) {
        e.preventDefault();
        
        // Calculate current distance for pinch-zoom
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const currentDistance = Math.hypot(
          touch1.clientX - touch2.clientX,
          touch1.clientY - touch2.clientY
        );
        
        // Calculate scale change
        const scaleFactor = currentDistance / initialTouchDistanceRef.current;
        const newScale = Math.max(
          minScale,
          Math.min(maxScale, initialScaleRef.current * scaleFactor)
        );
        
        // Calculate new pinch center
        const newCenter = {
          x: (touch1.clientX + touch2.clientX) / 2,
          y: (touch1.clientY + touch2.clientY) / 2
        };
        
        // Zoom towards the pinch center
        zoomTowardsPoint(newCenter, newScale);
      } 
      else if (isDraggingRef.current && e.touches.length === 1) {
        e.preventDefault();
        
        // Calculate movement delta
        const deltaX = e.touches[0].clientX - lastPointRef.current.x;
        const deltaY = e.touches[0].clientY - lastPointRef.current.y;
        
        // Update position
        setTranslateX(prev => prev + deltaX);
        setTranslateY(prev => prev + deltaY);
        
        // Update last point
        lastPointRef.current = { 
          x: e.touches[0].clientX, 
          y: e.touches[0].clientY 
        };
      }
    },
    [disableTouch, maxScale, minScale, zoomTowardsPoint]
  );

  const handleTouchEnd = useCallback(() => {
    if (disableTouch) return;
    
    isPinchingRef.current = false;
    
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      containerRef.current?.classList.remove('is-dragging');
    }
  }, [containerRef, disableTouch]);

  // Set up keyboard controls
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!containerRef.current?.contains(document.activeElement)) return;
      
      const panStep = 20; // pixels to move per key press
      const zoomStepFactor = e.altKey ? altZoomMultiplier : 1; // Enhance zoom with Alt key
      
      switch (e.key) {
        case 'ArrowUp':
          setTranslateY(prev => prev + panStep);
          e.preventDefault();
          break;
        case 'ArrowDown':
          setTranslateY(prev => prev - panStep);
          e.preventDefault();
          break;
        case 'ArrowLeft':
          setTranslateX(prev => prev + panStep);
          e.preventDefault();
          break;
        case 'ArrowRight':
          setTranslateX(prev => prev - panStep);
          e.preventDefault();
          break;
        case '+':
        case '=':
          setScale(prev => Math.min(maxScale, prev + (scaleStep * zoomStepFactor)));
          e.preventDefault();
          break;
        case '-':
        case '_':
          setScale(prev => Math.max(minScale, prev - (scaleStep * zoomStepFactor)));
          e.preventDefault();
          break;
        case '0':
          resetTransform();
          e.preventDefault();
          break;
      }
    },
    [altZoomMultiplier, containerRef, maxScale, minScale, resetTransform, scaleStep]
  );

  // Set up event listeners
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    // Apply initial styles
    container.style.transformOrigin = transformOrigin;
    container.tabIndex = 0; // Make container focusable for keyboard events
    
    // Set up initial CSS custom properties
    container.style.setProperty('--scale', '1');
    container.style.setProperty('--translateX', '0px');
    container.style.setProperty('--translateY', '0px');
    
    // Add class for grabbing cursor
    container.classList.add('zoom-pan-container');
    
    // Add event listeners
    container.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd);
    container.addEventListener('keydown', handleKeyDown);
    
    // Alt key detection for cursor hint
    const handleAltKeyDown = (e: KeyboardEvent) => {
      if (e.altKey) document.body.classList.add('alt-zoom-active');
    };
    
    const handleAltKeyUp = (e: KeyboardEvent) => {
      if (!e.altKey) document.body.classList.remove('alt-zoom-active');
    };
    
    window.addEventListener('keydown', handleAltKeyDown);
    window.addEventListener('keyup', handleAltKeyUp);
    
    return () => {
      // Clean up all event listeners
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
      container.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keydown', handleAltKeyDown);
      window.removeEventListener('keyup', handleAltKeyUp);
      
      // Remove added styles and classes
      container.classList.remove('zoom-pan-container', 'is-dragging');
      document.body.classList.remove('alt-zoom-active');
    };
  }, [
    containerRef,
    transformOrigin,
    handleWheel,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleKeyDown,
  ]);

  return {
    scale,
    translateX,
    translateY,
    resetTransform,
    setTransform,
    isDragging: isDraggingRef.current,
  };
}
