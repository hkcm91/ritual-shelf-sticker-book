
import React, { useEffect } from 'react';

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
  // Debug logging
  useEffect(() => {
    console.log(`SlotContainer ${position} mounted, hasBook: ${hasBook}`);
  }, [position, hasBook]);

  return (
    <div 
      className={`book-slot relative h-[220px] w-[150px] mx-1 rounded-sm overflow-visible
        ${!hasBook ? 'bg-white/10 hover:bg-gray-50/10' : 'bg-transparent'}
        transition-colors duration-200 cursor-pointer`}
      data-position={position}
      data-has-book={hasBook ? 'true' : 'false'}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      style={{ 
        opacity: 1,
        display: 'block',
        position: 'relative', // Ensure position is explicitly set
        zIndex: 1 // Set a base z-index
      }}
    >
      {children}
    </div>
  );
};

export default SlotContainer;
