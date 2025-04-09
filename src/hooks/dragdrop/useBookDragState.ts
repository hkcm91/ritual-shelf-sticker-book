
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
