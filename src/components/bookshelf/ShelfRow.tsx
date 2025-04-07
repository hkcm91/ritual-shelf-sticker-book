
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
    const dividers = shelfStyling?.dividers || { 
      enabled: false, 
      booksPerSection: 6,
      booksPerRow: 2,
      orientation: 'vertical'
    };
    
    // Create a container for this row that will include horizontal dividers if needed
    const needsHorizontalDivider = dividers.enabled && 
      ['horizontal', 'both'].includes(dividers.orientation) &&
      rowIndex > 0 && 
      rowIndex % (dividers.booksPerRow || 2) === 0;
    
    // Add a horizontal divider for this row if needed
    if (needsHorizontalDivider) {
      slots.push(
        <div 
          key={`hdivider-${rowIndex}`}
          className="horizontal-shelf-divider w-full" 
          style={{
            height: `${dividers.thickness || 4}px`,
            backgroundColor: dividers.color || '#714621',
            marginBottom: '12px'
          }}
        />
      );
    }
    
    // Add the book slots with vertical dividers if needed
    for (let col = 0; col < columns; col++) {
      const position = rowIndex * columns + col;
      
      // Add vertical divider if needed and if it's not the first column
      if (dividers.enabled && 
          ['vertical', 'both'].includes(dividers.orientation) && 
          col > 0 && 
          col % dividers.booksPerSection === 0) {
        slots.push(
          <div 
            key={`vdivider-${rowIndex}-${col}`}
            className="vertical-shelf-divider" 
            style={{
              width: `${dividers.thickness || 4}px`,
              backgroundColor: dividers.color || '#714621',
              height: '100%',
              minHeight: '220px',
              margin: '0 8px'
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
    <div className="flex flex-col w-full">
      {/* Books row with potential dividers */}
      <div className="flex justify-start items-stretch flex-nowrap gap-2 p-2 min-h-[220px]">
        {renderSlots()}
      </div>
      
      {/* Shelf */}
      <div 
        className="wood-shelf w-full mb-6"
        style={{
          height: `${shelfStyling?.thickness || 20}px`,
          backgroundImage: shelf?.textureImage ? `url(${shelf.textureImage})` : 'var(--shelf-texture, url(/textures/default/wood.jpg))',
          backgroundSize: '100% 100%',
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
