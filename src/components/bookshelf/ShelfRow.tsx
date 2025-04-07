
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
      color: '#714621'
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
            marginBottom: '12px'
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
              minHeight: '220px'
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
    
    // Add horizontal divider to the top of slots if needed
    if (needsHorizontalDivider) {
      slots.push(<div key="hdivider-slots" className="w-full">{slotRow}</div>);
    } else {
      slots.push(...slotRow);
    }
    
    return slots;
  };

  // Determine if we should use realistic shelf styling
  const useRealisticStyle = activeTheme === 'default' || activeTheme === 'custom';
  
  // Get custom shelf texture or use default
  const shelfTexture = shelf?.textureImage || 
                      (useRealisticStyle ? '/lovable-uploads/df4e485f-c6a6-48d8-990d-9ee89fcc76d0.png' : 
                      '/textures/default/wood.jpg');

  return (
    <div className={`shelf-row flex flex-col w-full relative ${useRealisticStyle ? 'realistic-shelf' : ''}`}>
      {/* Books row with potential dividers */}
      <div className="flex justify-start items-stretch flex-nowrap gap-2 p-2 min-h-[220px] relative z-2">
        {renderSlots()}
      </div>
      
      {/* Shelf */}
      <div 
        className="wood-shelf w-full mb-6 relative"
        style={{
          height: `${shelfStyling?.thickness || 20}px`,
          backgroundImage: `url(${shelfTexture})`,
          backgroundSize: '100% 100%',
          backgroundRepeat: 'repeat-x',
          backgroundPosition: 'center',
          backgroundColor: shelfStyling?.color || '#8B5A2B',
          opacity: shelfStyling?.opacity || 1,
          boxShadow: useRealisticStyle ? '0 6px 10px -2px rgba(0,0,0,0.4)' : '0px 4px 6px -2px rgba(0,0,0,0.3)'
        }}
      ></div>
    </div>
  );
};

export default ShelfRow;
