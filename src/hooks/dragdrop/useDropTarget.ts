
import { useCallback, useState, useEffect } from 'react';
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
  const [isDragOver, setIsDragOver] = useState(false);
  
  // Clean up drag state if hook unmounts while dragging over
  useEffect(() => {
    return () => {
      if (isDragOver) {
        setIsDragOver(false);
      }
    };
  }, [isDragOver]);
  
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Ensure dragEffect is set properly
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = 'move';
    }
    
    // Set drag over state for visual feedback
    setIsDragOver(true);
    
    if (onDragOver) {
      onDragOver(e);
    }
  }, [onDragOver]);
  
  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsDragOver(false);
    
    if (onDragLeave) {
      onDragLeave(e);
    }
  }, [onDragLeave]);
  
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsDragOver(false);
    
    try {
      // Check for file drop first
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        console.log("[useDropTarget] Files detected in drop event:", e.dataTransfer.files[0].name);
        return;
      }
      
      // Handle book drop
      const droppedItemId = e.dataTransfer.getData('text/plain');
      console.log("[useDropTarget] Item dropped with ID:", droppedItemId);
      
      if (droppedItemId && onDrop) {
        onDrop(droppedItemId, null);
      }
    } catch (error) {
      console.error("[useDropTarget] Error handling drop:", error);
      toast.error('Failed to drop item');
    }
  }, [onDrop]);
  
  return {
    isDragOver,
    handleDragOver,
    handleDragLeave,
    handleDrop
  };
};

export default useDropTarget;
