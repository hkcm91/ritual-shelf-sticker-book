
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
}
