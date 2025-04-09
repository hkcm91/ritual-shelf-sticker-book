
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
  
  const startDrag = useCallback((e: React.DragEvent, id: string) => {
    console.log("[useBookDragState] Starting drag for book:", id);
    
    try {
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
    }
  }, [setDraggedBook]);
  
  const endDrag = useCallback(() => {
    console.log("[useBookDragState] Drag ended");
    
    // Use a slight delay to ensure state is updated correctly
    setTimeout(() => {
      setDraggedBook(null);
      setIsDragging(false);
      setDragStart(null);
    }, 50);
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
