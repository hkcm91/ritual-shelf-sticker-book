
import React from 'react';

type SlotContainerProps = {
  children: React.ReactNode;
  position: number;
  hasBook: boolean;
  handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  handleMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleMouseUp: (e: React.MouseEvent<HTMLDivElement>) => void;
};

const SlotContainer: React.FC<SlotContainerProps> = ({
  children,
  position,
  hasBook,
  handleDragOver,
  handleDrop,
  handleMouseMove,
  handleMouseUp
}) => {
  return (
    <div 
      className={`book-slot relative h-[220px] w-[150px] mx-1 rounded-sm overflow-hidden
        ${!hasBook ? 'hover:bg-gray-50/10' : 'hover:border hover:border-primary/30'}
        transition-colors duration-200 cursor-pointer`}
      data-position={position}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {children}
    </div>
  );
};

export default SlotContainer;
