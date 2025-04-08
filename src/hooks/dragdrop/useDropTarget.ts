
import { useCallback } from 'react';
import { toast } from 'sonner';

export interface UseDropTargetProps {
  onDrop?: (id: string, data: any) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDragLeave?: (e: React.DragEvent) => void;
}

const useDropTarget = ({ 
  onDrop,
  onDragOver,
  onDragLeave
}: UseDropTargetProps = {}) => {
  // Handle drag over events for drop targets
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    // Add visual indicator class
    if (e.currentTarget.classList) {
      e.currentTarget.classList.add('drag-over');
    }
    
    // Call custom handler if provided
    if (onDragOver) {
      onDragOver(e);
    }
  }, [onDragOver]);
  
  // Handle drag leave events to remove visual indicators
  const handleDragLeave = useCallback((e: React.DragEvent) => {
    // Remove visual indicator class
    if (e.currentTarget.classList) {
      e.currentTarget.classList.remove('drag-over');
    }
    
    // Call custom handler if provided
    if (onDragLeave) {
      onDragLeave(e);
    }
  }, [onDragLeave]);
  
  // Generic drop handler
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    
    // Remove visual indicator class
    if (e.currentTarget.classList) {
      e.currentTarget.classList.remove('drag-over');
    }
    
    const droppedItemId = e.dataTransfer.getData('text/plain');
    
    if (droppedItemId && onDrop) {
      onDrop(droppedItemId, e.dataTransfer.getData('application/json'));
      toast.success('Item dropped successfully');
    }
  }, [onDrop]);
  
  return {
    handleDragOver,
    handleDragLeave,
    handleDrop
  };
};

export default useDropTarget;
