
import React, { useRef, useEffect } from 'react';
import { SlotType } from '@/store/types';

type SlotContainerProps = {
  position: number;
  slotType: SlotType;
  children: React.ReactNode;
  isDragOver: boolean;
  useRealisticStyle: boolean;
  handleDragOver: (e: React.DragEvent) => void;
  handleDragLeave: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent) => void;
};

const SlotContainer: React.FC<SlotContainerProps> = ({
  position,
  slotType,
  children,
  isDragOver,
  useRealisticStyle,
  handleDragOver,
  handleDragLeave,
  handleDrop
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Prevent default behavior for all drag events to ensure proper handling
  const onDragOver = (e: React.DragEvent) => {
    // Always prevent default to allow drop
    e.preventDefault();
    e.stopPropagation();
    console.log(`[SlotContainer] Drag over event on position ${position}, slot type ${slotType}`);
    
    handleDragOver(e);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log(`[SlotContainer] Drag leave event on position ${position}, slot type ${slotType}`);
    
    handleDragLeave(e);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log(`[SlotContainer] Drop event on position ${position}, slot type ${slotType}`);
    
    // Log file information if available
    if (e.dataTransfer.files?.length > 0) {
      const file = e.dataTransfer.files[0];
      console.log(`[SlotContainer] File dropped: ${file.name}, type: ${file.type}, size: ${file.size}`);
    } else {
      // Check for text data which might be a book ID
      const textData = e.dataTransfer.getData('text/plain');
      if (textData) {
        console.log(`[SlotContainer] Text data dropped: ${textData}`);
      }
    }
    
    handleDrop(e);
  };
  
  // Add global listeners to ensure drops are handled correctly
  useEffect(() => {
    const preventDefaultDrag = (e: DragEvent) => {
      e.preventDefault();
    };
    
    // Add listeners to document to ensure drag events work correctly
    document.addEventListener('dragover', preventDefaultDrag);
    document.addEventListener('drop', preventDefaultDrag);
    
    return () => {
      document.removeEventListener('dragover', preventDefaultDrag);
      document.removeEventListener('drop', preventDefaultDrag);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className={`book-slot relative h-[220px] w-[150px] mx-1 rounded-sm
        ${isDragOver ? 'bg-blue-100 border-2 border-blue-400 drag-over' : ''}
        ${useRealisticStyle ? 'realistic-book-slot' : ''}
        transition-colors duration-200 cursor-pointer`}
      data-position={position}
      data-slot-type={slotType}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      style={{
        boxShadow: useRealisticStyle ? 'inset 0 0 20px rgba(0,0,0,0.1)' : 'none'
      }}
    >
      {children}
    </div>
  );
};

export default SlotContainer;
