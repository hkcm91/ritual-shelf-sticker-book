
import React from 'react';
import BookSlot from '../BookSlot';
import { useBookshelfStore } from '../../store/bookshelfStore';

type ShelfRowProps = {
  rowIndex: number;
  columns: number;
};

const ShelfRow: React.FC<ShelfRowProps> = ({ rowIndex, columns }) => {
  const { activeShelfId } = useBookshelfStore();
  
  // Generate slots for this row
  const renderSlots = () => {
    const slots = [];
    
    for (let col = 0; col < columns; col++) {
      const position = rowIndex * columns + col;
      slots.push(
        <BookSlot
          key={`slot-${position}`}
          position={position}
        />
      );
    }
    
    return slots;
  };

  return (
    <div className="flex flex-col">
      <div className="flex justify-center space-x-2 p-2">
        {renderSlots()}
      </div>
      
      {/* Shelf - using CSS variables */}
      <div className="wood-shelf w-full mb-6"></div>
    </div>
  );
};

export default ShelfRow;
