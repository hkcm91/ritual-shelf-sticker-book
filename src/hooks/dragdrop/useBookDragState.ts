
import { useState, useCallback } from 'react';
import { useBookshelfStore } from '../../store/bookshelfStore';
import { Point } from '../dragdrop';
import { toast } from 'sonner';

export interface UseBookDragStateProps {
  bookId?: string;
}

const useBookDragState = ({ bookId }: UseBookDragStateProps) => {
  const { setDraggedBook } = useBookshelfStore();
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<Point | null>(null);
  
  const startDrag = useCallback((e: React.DragEvent | React.MouseEvent, id: string) => {
    // First, prevent default behavior to ensure we control the drag
    e.preventDefault();
    e.stopPropagation();
    
    if ('dataTransfer' in e) {
      try {
        // Set required data transfer properties
        e.dataTransfer.setData('text/plain', id);
        e.dataTransfer.effectAllowed = 'move';
        
        // For better visual feedback
        if (e.currentTarget instanceof HTMLElement) {
          e.currentTarget.classList.add('dragging');
          const rect = e.currentTarget.getBoundingClientRect();
          e.dataTransfer.setDragImage(e.currentTarget, rect.width / 2, rect.height / 2);
        }
      } catch (error) {
        console.error("[useBookDragState] Error setting dataTransfer:", error);
        toast.error("Error starting drag operation");
        return; // Don't proceed if we can't set up drag properly
      }
    }
    
    // Set the dragged book in the store
    setDraggedBook(id);
    setIsDragging(true);
    
    // Record starting position for dragging calculations
    if ('clientX' in e && 'clientY' in e) {
      setDragStart({
        x: e.clientX,
        y: e.clientY
      });
    }
    
    console.log("[useBookDragState] Drag started for book:", id);
  }, [setDraggedBook]);
  
  const endDrag = useCallback((e?: React.DragEvent | React.MouseEvent) => {
    if (e && 'preventDefault' in e) {
      e.preventDefault();
      e.stopPropagation();
      
      // Remove visual feedback
      if (e.currentTarget instanceof HTMLElement) {
        e.currentTarget.classList.remove('dragging');
      }
    }
    
    // Reset drag state
    setDraggedBook(null);
    setIsDragging(false);
    setDragStart(null);
    
    console.log("[useBookDragState] Drag ended");
  }, [setDraggedBook]);
  
  return {
    isDragging,
    setIsDragging,
    dragStart,
    setDragStart,
    startDrag,
    endDrag
  };
};

export default useBookDragState;
