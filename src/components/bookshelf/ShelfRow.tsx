
import React from 'react';
import BookSlot from '../BookSlot';
import { useBookshelfStore } from '../../store/bookshelfStore';
import { ShelfData } from '../../store/types';

type ShelfRowProps = {
  rowIndex: number;
  columns: number;
};

const ShelfRow: React.FC<ShelfRowProps> = ({ rowIndex, columns }) => {
  const { activeShelfId, shelves: shelvesData, shelves: customShelves } = useBookshelfStore();
  const shelf = shelvesData[activeShelfId] as ShelfData;
  
  // Generate slots for this row
  const renderSlots = () => {
    const slots = [];
    
    // Access dividers from the customization state
    const dividers = customShelves.dividers || { enabled: false, booksPerSection: 6 };
    
    for (let col = 0; col < columns; col++) {
      const position = rowIndex * columns + col;
      
      // Add divider if needed
      if (dividers.enabled && col > 0 && col % dividers.booksPerSection === 0) {
        slots.push(
          <div 
            key={`divider-${rowIndex}-${col}`}
            className="shelf-divider" 
            style={{
              width: `var(--divider-thickness)`,
              backgroundColor: `var(--divider-color)`,
              height: '100%'
            }}
          />
        );
      }
      
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
