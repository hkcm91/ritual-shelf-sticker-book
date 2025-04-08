
import { useCallback, useEffect, useRef, useState } from 'react';

interface ZoomPanOptions {
  minScale?: number;
  maxScale?: number;
  scaleStep?: number;
  transformOrigin?: string;
  disableWheel?: boolean;
  disableTouch?: boolean;
  disableDrag?: boolean;
  throttleDelay?: number;
  altZoomMultiplier?: number;
}

interface ZoomPanState {
  scale: number;
  translateX: number;
  translateY: number;
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
    throttleDelay = 0,
    altZoomMultiplier = 2.5,
  }: ZoomPanOptions = {}
) {
  // State for transform values
  const [state, setState] = useState<ZoomPanState>({
    scale: 1,
    translateX: 0,
    translateY: 0,
  });

  // Refs for internal tracking
  const isDraggingRef = useRef(false);
  const lastPointRef = useRef({ x: 0, y: 0 });
  const startPointRef = useRef({ x: 0, y: 0 });
  const inertiaRef = useRef({ x: 0, y: 0 });
  const initialTouchDistanceRef = useRef(0);
  const initialScaleRef = useRef(1);
  const isPinchingRef = useRef(false);
  const rafIdRef = useRef<number | null>(null);
  const throttleTimerRef = useRef<number | null>(null);
  const pinchCenterRef = useRef({ x: 0, y: 0 });

  // Helper to throttle function calls
  const throttle = useCallback(
    (fn: Function) => {
      if (throttleDelay <= 0) return fn();
      
      if (throttleTimerRef.current === null) {
        throttleTimerRef.current = window.setTimeout(() => {
          fn();
          throttleTimerRef.current = null;
        }, throttleDelay);
      }
    },
    [throttleDelay]
  );

  // Apply transforms to container using CSS variables
  const applyTransform = useCallback(() => {
    if (!containerRef.current) return;
    
    containerRef.current.style.setProperty('--scale', state.scale.toString());
    containerRef.current.style.setProperty('--translateX', `${state.translateX}px`);
    containerRef.current.style.setProperty('--translateY', `${state.translateY}px`);
  }, [containerRef, state]);

  // Update transform state with throttling if needed
  const updateTransform = useCallback(
    (newState: Partial<ZoomPanState>) => {
      throttle(() => {
        setState(prev => {
          const updated = {
            scale: Math.min(maxScale, Math.max(minScale, newState.scale !== undefined ? newState.scale : prev.scale)),
            translateX: newState.translateX !== undefined ? newState.translateX : prev.translateX,
            translateY: newState.translateY !== undefined ? newState.translateY : prev.translateY
          };
          
          return updated;
        });
      });
    },
    [maxScale, minScale, throttle]
  );
  
  // Apply inertia animation after dragging
  const applyInertia = useCallback(() => {
    if (Math.abs(inertiaRef.current.x) < 0.5 && Math.abs(inertiaRef.current.y) < 0.5) {
      rafIdRef.current = null;
      return;
    }

    // Reduce velocity with each frame
    inertiaRef.current = {
      x: inertiaRef.current.x * 0.95,
      y: inertiaRef.current.y * 0.95
    };

    // Apply the inertia to translate values
    setState(prev => ({
      ...prev,
      translateX: prev.translateX + inertiaRef.current.x,
      translateY: prev.translateY + inertiaRef.current.y
    }));

    // Continue animation
    rafIdRef.current = requestAnimationFrame(applyInertia);
  }, []);

  // Zoom towards the point (mouse position or pinch center)
  const zoomTowardsPoint = useCallback(
    (point: { x: number; y: number }, scaleDelta: number) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const offsetX = point.x - rect.left;
      const offsetY = point.y - rect.top;
      
      setState(prev => {
        const newScale = Math.max(minScale, Math.min(maxScale, prev.scale + scaleDelta));
        const scaleRatio = newScale / prev.scale;
        
        // Calculate new position to zoom towards cursor
        const newTranslateX = offsetX - (offsetX - prev.translateX) * scaleRatio;
        const newTranslateY = offsetY - (offsetY - prev.translateY) * scaleRatio;
        
        return {
          scale: newScale,
          translateX: newTranslateX,
          translateY: newTranslateY
        };
      });
    },
    [containerRef, maxScale, minScale]
  );

  // Wheel event handler for zooming
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      if (disableWheel) return;
      
      // Use Alt+wheel for zooming, normal wheel for scrolling
      if (e.altKey) {
        e.preventDefault();
        // Enhanced zoom speed when Alt is pressed
        const delta = e.deltaY * -0.001 * altZoomMultiplier;
        
        // Zoom towards cursor position
        zoomTowardsPoint(
          { x: e.clientX, y: e.clientY },
          delta * scaleStep * 10
        );
      } 
    },
    [disableWheel, scaleStep, zoomTowardsPoint, altZoomMultiplier]
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
      startPointRef.current = { x: e.clientX, y: e.clientY };
      
      // Cancel any ongoing inertia
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      
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
      
      // Store for inertia calculations
      inertiaRef.current = {
        x: deltaX,
        y: deltaY
      };
      
      // Update position
      setState(prev => ({
        ...prev,
        translateX: prev.translateX + deltaX,
        translateY: prev.translateY + deltaY
      }));
      
      // Update last point
      lastPointRef.current = { x: e.clientX, y: e.clientY };
    },
    []
  );

  const handleMouseUp = useCallback(() => {
    if (!isDraggingRef.current) return;
    
    isDraggingRef.current = false;
    containerRef.current?.classList.remove('is-dragging');
    
    // Apply inertia effect if movement was significant
    if (Math.abs(inertiaRef.current.x) > 1 || Math.abs(inertiaRef.current.y) > 1) {
      rafIdRef.current = requestAnimationFrame(applyInertia);
    }
  }, [applyInertia, containerRef]);

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
        initialScaleRef.current = state.scale;
        
        // Calculate pinch center point
        pinchCenterRef.current = {
          x: (touch1.clientX + touch2.clientX) / 2,
          y: (touch1.clientY + touch2.clientY) / 2
        };
      } 
      else if (e.touches.length === 1) {
        // Single touch for panning
        isDraggingRef.current = true;
        lastPointRef.current = { 
          x: e.touches[0].clientX, 
          y: e.touches[0].clientY 
        };
        startPointRef.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY
        };
        
        // Cancel any ongoing inertia
        if (rafIdRef.current) {
          cancelAnimationFrame(rafIdRef.current);
          rafIdRef.current = null;
        }
        
        // Add dragging class
        containerRef.current?.classList.add('is-dragging');
      }
    },
    [disableTouch, state.scale, containerRef]
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
        zoomTowardsPoint(newCenter, newScale - state.scale);
        
        // Update pinch center for next move
        pinchCenterRef.current = newCenter;
      } 
      else if (isDraggingRef.current && e.touches.length === 1) {
        e.preventDefault();
        
        // Calculate movement delta
        const deltaX = e.touches[0].clientX - lastPointRef.current.x;
        const deltaY = e.touches[0].clientY - lastPointRef.current.y;
        
        // Store for inertia calculations
        inertiaRef.current = {
          x: deltaX,
          y: deltaY
        };
        
        // Update position
        setState(prev => ({
          ...prev,
          translateX: prev.translateX + deltaX,
          translateY: prev.translateY + deltaY
        }));
        
        // Update last point
        lastPointRef.current = { 
          x: e.touches[0].clientX, 
          y: e.touches[0].clientY 
        };
      }
    },
    [disableTouch, maxScale, minScale, state.scale, zoomTowardsPoint]
  );

  const handleTouchEnd = useCallback(() => {
    if (disableTouch) return;
    
    isPinchingRef.current = false;
    
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      containerRef.current?.classList.remove('is-dragging');
      
      // Apply inertia effect if movement was significant
      if (Math.abs(inertiaRef.current.x) > 1 || Math.abs(inertiaRef.current.y) > 1) {
        rafIdRef.current = requestAnimationFrame(applyInertia);
      }
    }
  }, [applyInertia, disableTouch, containerRef]);

  // Set up keyboard controls
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const panStep = 20; // pixels to move per key press
      const zoomStepMultiplier = e.altKey ? altZoomMultiplier : 1; // Enhance zoom with Alt key
      
      switch (e.key) {
        case 'ArrowUp':
          updateTransform({ translateY: state.translateY + panStep });
          e.preventDefault();
          break;
        case 'ArrowDown':
          updateTransform({ translateY: state.translateY - panStep });
          e.preventDefault();
          break;
        case 'ArrowLeft':
          updateTransform({ translateX: state.translateX + panStep });
          e.preventDefault();
          break;
        case 'ArrowRight':
          updateTransform({ translateX: state.translateX - panStep });
          e.preventDefault();
          break;
        case '+':
        case '=':
          updateTransform({ 
            scale: state.scale + (scaleStep * zoomStepMultiplier) 
          });
          e.preventDefault();
          break;
        case '-':
        case '_':
          updateTransform({ 
            scale: state.scale - (scaleStep * zoomStepMultiplier) 
          });
          e.preventDefault();
          break;
        case '0':
          // Reset to default
          setState({ scale: 1, translateX: 0, translateY: 0 });
          e.preventDefault();
          break;
      }
    },
    [scaleStep, state, updateTransform, altZoomMultiplier]
  );

  // Reset zoom and position
  const resetTransform = useCallback(() => {
    setState({ scale: 1, translateX: 0, translateY: 0 });
  }, []);

  // Set transform directly (useful for programmatic control)
  const setTransform = useCallback((transform: Partial<ZoomPanState>) => {
    setState(prev => ({
      scale: transform.scale !== undefined ? 
        Math.min(maxScale, Math.max(minScale, transform.scale)) : 
        prev.scale,
      translateX: transform.translateX !== undefined ? transform.translateX : prev.translateX,
      translateY: transform.translateY !== undefined ? transform.translateY : prev.translateY
    }));
  }, [maxScale, minScale]);

  // Apply transforms whenever state changes
  useEffect(() => {
    applyTransform();
  }, [applyTransform, state]);

  // Set up event listeners
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    // Apply initial styles
    container.style.transformOrigin = transformOrigin;
    container.style.touchAction = 'none';
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
    window.addEventListener('mouseleave', handleMouseUp);
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
      window.removeEventListener('mouseleave', handleMouseUp);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
      container.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keydown', handleAltKeyDown);
      window.removeEventListener('keyup', handleAltKeyUp);
      
      // Clean up animation frames
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
      
      // Clean up throttle timer
      if (throttleTimerRef.current) {
        clearTimeout(throttleTimerRef.current);
      }
      
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
    scale: state.scale,
    translateX: state.translateX,
    translateY: state.translateY,
    resetTransform,
    setTransform,
    isDragging: isDraggingRef.current,
  };
}
