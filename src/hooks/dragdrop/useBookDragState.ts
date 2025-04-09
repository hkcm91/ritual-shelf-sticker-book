
import { useState, useCallback, useEffect } from 'react';
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
  
  // Clean up drag state if hook unmounts while dragging
  useEffect(() => {
    return () => {
      if (isDragging) {
        setDraggedBook(null);
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
      
      setDraggedBook(id);
      setIsDragging(true);
      
      if ('clientX' in e && 'clientY' in e) {
        setDragStart({
          x: e.clientX,
          y: e.clientY
        });
      }
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
