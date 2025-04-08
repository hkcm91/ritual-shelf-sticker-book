
import { useCoreDragGestures } from './useCoreDragGestures';
import { DragGesturesOptions, DragHandlers } from './types';

/**
 * A reusable hook for implementing drag-to-pan functionality
 * Can be used in any component that needs dragging behavior
 */
export function useDragGestures(options: DragGesturesOptions): DragHandlers {
  return useCoreDragGestures(options);
}

export { DragGesturesOptions, DragHandlers };
export * from './types';
