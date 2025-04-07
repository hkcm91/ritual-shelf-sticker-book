
import React from 'react';
import BookSlot from '../BookSlot';
import { useBookshelfStore } from '../../store/bookshelfStore';
import { ShelfData } from '../../store/types';

type ShelfRowProps = {
  rowIndex: number;
  columns: number;
};

const ShelfRow: React.FC<ShelfRowProps> = ({ rowIndex, columns }) => {
  const { activeShelfId, shelves: shelvesData, shelfStyling } = useBookshelfStore();
  const shelf = shelvesData[activeShelfId] as ShelfData;
  
  // Generate slots for this row
  const renderSlots = () => {
    const slots = [];
    
    // Access dividers from the customization state
    const dividers = shelfStyling?.dividers || { enabled: false, booksPerSection: 6 };
    
    for (let col = 0; col < columns; col++) {
      const position = rowIndex * columns + col;
      
      // Add divider if needed and if it's not the first column
      if (dividers.enabled && col > 0 && col % dividers.booksPerSection === 0) {
        slots.push(
          <div 
            key={`divider-${rowIndex}-${col}`}
            className="shelf-divider" 
            style={{
              width: `${dividers.thickness || 4}px`,
              backgroundColor: dividers.color || '#714621',
              height: '100%',
              minHeight: '220px',
              margin: '0 8px' // Add some spacing around dividers
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
    <div className="shelf-row flex flex-col w-full mb-10">
      {/* Books row - Improved vertical alignment with better padding */}
      <div className="flex justify-start items-center flex-nowrap gap-2 p-2 min-h-[220px] pb-4">
        {renderSlots()}
      </div>
      
      {/* Shelf */}
      <div 
        className="wood-shelf w-full"
        style={{
          height: `${shelfStyling?.thickness || 20}px`,
          backgroundImage: shelf?.textureImage ? `url(${shelf.textureImage})` : 'var(--shelf-texture, url(/textures/default/wood.jpg))',
          backgroundSize: '100% 100%', // Changed from 'cover' to '100% 100%' to prevent stretching
          backgroundRepeat: 'repeat-x',
          backgroundPosition: 'center',
          backgroundColor: shelfStyling?.color || '#8B5A2B',
          opacity: shelfStyling?.opacity || 1,
          boxShadow: '0px 4px 6px -2px rgba(0,0,0,0.3)'
        }}
      ></div>
    </div>
  );
};

export default ShelfRow;
