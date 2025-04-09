
import { useCallback, useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';

export interface UseDropTargetProps {
  position: number;
  slotType: string;
  onDrop?: (id: string, data: any) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDragLeave?: (e: React.DragEvent) => void;
  onFileDropped?: (file: File) => void;
}

const useDropTarget = ({ 
  position,
  slotType,
  onDrop,
  onDragOver,
  onDragLeave,
  onFileDropped
}: UseDropTargetProps) => {
  const [isDragOver, setIsDragging] = useState(false);
  const dragOverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Clean up drag state if hook unmounts while dragging over
  useEffect(() => {
    return () => {
      if (isDragOver) {
        console.log(`[useDropTarget] Cleaning up drag-over state on unmount for position ${position}`);
        setIsDragging(false);
      }
      
      if (dragOverTimeoutRef.current) {
        clearTimeout(dragOverTimeoutRef.current);
      }
    };
  }, [isDragOver, position]);
  
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Clear any existing timeout to avoid flashing
    if (dragOverTimeoutRef.current) {
      clearTimeout(dragOverTimeoutRef.current);
    }
    
    // Ensure dragEffect is set properly
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = 'move';
    }
    
    // Get information about dragged data
    const hasFiles = e.dataTransfer.types.includes('Files');
    const hasText = e.dataTransfer.types.includes('text/plain');
    
    console.log(`[useDropTarget] Drag over at position ${position}, slotType ${slotType}. Has files: ${hasFiles}, Has text: ${hasText}`);
    
    // Set drag over state for visual feedback
    setIsDragging(true);
    
    if (onDragOver) {
      onDragOver(e);
    }
  }, [onDragOver, position, slotType]);
  
  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Use a small timeout to prevent flashing when moving cursor within the element
    dragOverTimeoutRef.current = setTimeout(() => {
      console.log(`[useDropTarget] Drag leave at position ${position}`);
      setIsDragging(false);
      
      if (onDragLeave) {
        onDragLeave(e);
      }
    }, 50);
    
  }, [onDragLeave, position]);
  
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log(`[useDropTarget] Drop event at position ${position}, slotType ${slotType}`);
    setIsDragging(false);
    
    if (dragOverTimeoutRef.current) {
      clearTimeout(dragOverTimeoutRef.current);
    }
    
    try {
      // Check for file drop first
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const file = e.dataTransfer.files[0];
        console.log(`[useDropTarget] File dropped at position ${position}: ${file.name}, type: ${file.type}`);
        
        if (onFileDropped) {
          onFileDropped(file);
          return;
        }
      }
      
      // Handle book drop
      const droppedItemId = e.dataTransfer.getData('text/plain');
      if (droppedItemId) {
        console.log(`[useDropTarget] Item dropped with ID: ${droppedItemId} at position ${position}`);
        
        if (onDrop) {
          onDrop(droppedItemId, null);
        }
      } else {
        console.log(`[useDropTarget] No valid data found in drop event at position ${position}`);
      }
    } catch (error) {
      console.error(`[useDropTarget] Error handling drop at position ${position}:`, error);
      toast.error('Failed to process dropped item');
    }
  }, [onDrop, onFileDropped, position, slotType]);
  
  return {
    isDragOver,
    handleDragOver,
    handleDragLeave,
    handleDrop
  };
};

export default useDropTarget;
