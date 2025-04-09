
import { useState, useCallback } from 'react';
import { useBookshelfStore } from '../../store/bookshelfStore';
import { Point } from '../dragdrop';

export interface UseBookDragStateProps {
  bookId?: string;
}

const useBookDragState = ({ bookId }: UseBookDragStateProps) => {
  const { setDraggedBook } = useBookshelfStore();
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<Point | null>(null);
  
  const startDrag = useCallback((e: React.DragEvent | React.MouseEvent, id: string) => {
    if ('dataTransfer' in e) {
      e.dataTransfer.setData('text/plain', id);
      e.dataTransfer.effectAllowed = 'move';
    }
    
    setDraggedBook(id);
    setIsDragging(true);
    
    if ('clientX' in e && 'clientY' in e) {
      setDragStart({
        x: e.clientX,
        y: e.clientY
      });
    }
    
    // Prevent default to allow drag
    e.preventDefault();
  }, [setDraggedBook]);
  
  const endDrag = useCallback((e?: React.DragEvent | React.MouseEvent) => {
    if (e && 'preventDefault' in e) {
      e.preventDefault();
    }
    
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
