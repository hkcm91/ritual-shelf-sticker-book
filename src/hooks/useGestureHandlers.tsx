
import { useGestureHandlers as useRefactoredGestureHandlers } from './gestures/useGestureHandlers';

/**
 * Re-export of useGestureHandlers for backward compatibility
 * This ensures any components using the old import path will continue to work
 */
export function useGestureHandlers(
  containerRef: React.RefObject<HTMLElement>,
  scrollAreaRef: React.RefObject<HTMLElement>,
  setIsDragging?: (isDragging: boolean) => void
) {
  // Simply pass through to the refactored implementation
  return useRefactoredGestureHandlers(containerRef, scrollAreaRef, setIsDragging);
}

export default useGestureHandlers;
