
import { useCoreDragGestures } from './useCoreDragGestures';
import { DragGesturesOptions, DragHandlers } from './types';

/**
 * A reusable hook for implementing drag-to-pan functionality
 * Can be used in any component that needs dragging behavior
 */
export function useDragGestures(options: DragGesturesOptions): DragHandlers {
  return useCoreDragGestures(options);
}

// Use 'export type' for re-exporting types when 'isolatedModules' is enabled
export type { DragGesturesOptions, DragHandlers };
export * from './types';
