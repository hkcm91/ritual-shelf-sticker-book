
import { useState, useCallback, useEffect, useRef } from 'react';
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
  const dragTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Clean up drag state if hook unmounts while dragging
  useEffect(() => {
    return () => {
      if (isDragging) {
        console.log("[useBookDragState] Cleaning up drag state on unmount");
        setDraggedBook(null);
      }
      
      if (dragTimeoutRef.current) {
        clearTimeout(dragTimeoutRef.current);
      }
    };
  }, [isDragging, setDraggedBook]);
  
  const startDrag = useCallback((e: React.DragEvent, id: string) => {
    console.log("[useBookDragState] Starting drag for book:", id);
    
    try {
      // Ensure the dataTransfer is properly set
      if (!e.dataTransfer) {
        throw new Error("DataTransfer not available");
      }
      
      e.dataTransfer.setData('text/plain', id);
      e.dataTransfer.effectAllowed = 'move';
      
      // Set the drag image if possible
      if (e.currentTarget instanceof HTMLElement) {
        // Try to use the element itself as drag image
        try {
          e.dataTransfer.setDragImage(e.currentTarget, 0, 0);
        } catch (err) {
          console.warn("[useBookDragState] Could not set drag image:", err);
        }
      }
      
      setDraggedBook(id);
      setIsDragging(true);
      
      if ('clientX' in e && 'clientY' in e) {
        setDragStart({
          x: e.clientX,
          y: e.clientY
        });
      }
      
      // Set a backup timeout to end drag if dragend doesn't fire
      dragTimeoutRef.current = setTimeout(() => {
        console.log("[useBookDragState] Drag safety timeout triggered");
        endDrag();
      }, 5000);
    } catch (error) {
      console.error("[useBookDragState] Error setting drag data:", error);
      toast.error("Failed to start dragging");
    }
  }, [setDraggedBook]);
  
  const endDrag = useCallback(() => {
    console.log("[useBookDragState] Drag ended");
    setDraggedBook(null);
    setIsDragging(false);
    setDragStart(null);
    
    if (dragTimeoutRef.current) {
      clearTimeout(dragTimeoutRef.current);
      dragTimeoutRef.current = null;
    }
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
