
import React from 'react';
import BookSlot from '../BookSlot';
import { useBookshelfStore } from '../../store/bookshelfStore';
import { ShelfData } from '../../store/types';

type ShelfRowProps = {
  rowIndex: number;
  columns: number;
};

const ShelfRow: React.FC<ShelfRowProps> = ({ rowIndex, columns }) => {
  const { activeShelfId, shelves: shelvesData, shelfStyling, activeTheme } = useBookshelfStore();
  const shelf = shelvesData[activeShelfId] as ShelfData;
  
  // Generate slots for this row
  const renderSlots = () => {
    const slots = [];
    
    // Access dividers from the customization state
    const dividers = shelfStyling?.dividers || { 
      enabled: false, 
      booksPerSection: 6,
      booksPerRow: 2,
      orientation: 'vertical',
      thickness: 2,
      color: '#714621',
      opacity: 1
    };
    
    // Add a horizontal divider for this row if needed
    const needsHorizontalDivider = dividers.enabled && 
      ['horizontal', 'both'].includes(dividers.orientation) &&
      rowIndex > 0 && 
      rowIndex % (dividers.booksPerRow || 2) === 0;
    
    if (needsHorizontalDivider) {
      slots.push(
        <div 
          key={`hdivider-${rowIndex}`}
          className="horizontal-shelf-divider w-full" 
          style={{
            height: `${dividers.thickness || 2}px`,
            backgroundColor: dividers.color || '#714621',
            marginBottom: '12px',
            opacity: dividers.opacity
          }}
        />
      );
    }
    
    // Add the book slots with vertical dividers if needed
    const slotRow = [];
    for (let col = 0; col < columns; col++) {
      const position = rowIndex * columns + col;
      
      // Add vertical divider if needed and if it's not the first column
      if (dividers.enabled && 
          ['vertical', 'both'].includes(dividers.orientation) && 
          col > 0 && 
          col % (dividers.booksPerSection || 6) === 0) {
        slotRow.push(
          <div 
            key={`vdivider-${rowIndex}-${col}`}
            className="vertical-shelf-divider" 
            style={{
              width: `${dividers.thickness || 2}px`,
              backgroundColor: dividers.color || '#714621',
              height: '100%',
              minHeight: '220px',
              opacity: dividers.opacity
            }}
          />
        );
      }
      
      slotRow.push(
        <BookSlot
          key={`slot-${position}`}
          position={position}
        />
      );
    }
    
    // Add the row of slots
    slots.push(
      <div key={`slot-row-${rowIndex}`} className="flex justify-start items-stretch flex-nowrap gap-2 p-2 min-h-[220px] relative z-2">
        {slotRow}
      </div>
    );
    
    return slots;
  };

  // Determine if we should use realistic shelf styling
  const useRealisticStyle = activeTheme === 'default' || activeTheme === 'custom';
  
  // Get custom shelf texture or use default
  const shelfTexture = shelf?.textureImage || 
                      (useRealisticStyle ? '/lovable-uploads/7a437784-0910-4719-b52b-6564c3004ebe.png' : 
                      '/textures/default/wood.jpg');

  return (
    <div className={`shelf-row flex flex-col w-full relative ${useRealisticStyle ? 'realistic-shelf' : ''}`}>
      {/* Shelf back panel for realistic look */}
      <div 
        className="bookshelf-back-panel absolute top-0 left-0 right-0 bottom-0 z-0"
        style={{
          backgroundColor: shelfStyling?.color || '#7c5738',
          backgroundImage: `url(${shelfTexture})`,
          backgroundSize: '100% 100%',
          opacity: 0.8,
          filter: 'brightness(0.6)'
        }}
      ></div>
      
      {/* Render books and dividers */}
      {renderSlots()}
      
      {/* Shelf */}
      <div 
        className="wood-shelf w-full mb-6 relative z-10"
        style={{
          height: `${shelfStyling?.thickness || 20}px`,
          backgroundImage: `url(${shelfTexture})`,
          backgroundSize: '100% 100%',
          backgroundRepeat: 'repeat-x',
          backgroundPosition: 'center',
          backgroundColor: shelfStyling?.color || '#7c5738',
          opacity: shelfStyling?.opacity || 1,
          boxShadow: useRealisticStyle ? '0 6px 10px rgba(0,0,0,0.4)' : '0px 4px 6px -2px rgba(0,0,0,0.3)'
        }}
      ></div>
    </div>
  );
};

export default ShelfRow;
