
import React, { ReactNode } from 'react';
import { SlotType } from '@/store/types';

type SlotContainerProps = {
  position: number;
  slotType: SlotType;
  children: ReactNode;
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
  const handleDragOverSafe = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleDragOver(e);
  };

  const handleDragLeaveSafe = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleDragLeave(e);
  };

  const handleDropSafe = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleDrop(e);
  };

  return (
    <div 
      className={`book-slot relative h-[220px] w-[150px] mx-1 rounded-sm
        ${isDragOver ? 'bg-blue-100 border-2 border-blue-400' : ''}
        ${useRealisticStyle ? 'realistic-book-slot' : ''}
        transition-colors duration-200 cursor-pointer`}
      data-position={position}
      data-slot-type={slotType}
      onDragOver={handleDragOverSafe}
      onDragLeave={handleDragLeaveSafe}
      onDrop={handleDropSafe}
      style={{
        boxShadow: useRealisticStyle ? 'inset 0 0 20px rgba(0,0,0,0.1)' : 'none'
      }}
    >
      {children}
    </div>
  );
};

export default SlotContainer;
