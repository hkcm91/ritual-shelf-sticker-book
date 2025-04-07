
import React from 'react';
import BookSlot from '../BookSlot';
import { useBookshelfStore } from '../../store/bookshelfStore';
import { ShelfData } from '../../store/types';

type ShelfRowProps = {
  rowIndex: number;
  columns: number;
};

const ShelfRow: React.FC<ShelfRowProps> = ({
  rowIndex,
  columns
}) => {
  const {
    activeShelfId,
    shelves: shelvesData,
    shelfStyling,
    activeTheme
  } = useBookshelfStore();
  const shelf = shelvesData[activeShelfId] as ShelfData;

  // Generate slots for this row
  const renderSlots = () => {
    const slots = [];

    // Access dividers from the customization state
    const dividers = shelfStyling?.dividers || {
      enabled: false,
      booksPerSection: 4,
      booksPerRow: 1,
      orientation: 'vertical',
      thickness: 6,
      color: '#714621',
      opacity: 0.8,
      height: 200
    };

    // Get shelf texture or use default
    const shelfTexture = shelf?.textureImage || (activeTheme === 'default' || activeTheme === 'custom' ? '/lovable-uploads/7a437784-0910-4719-b52b-6564c3004ebe.png' : '/textures/default/wood.jpg');

    // Add the book slots with vertical dividers if needed
    const slotRow = [];

    // Add left side divider (bookend)
    if (dividers.enabled && (dividers.orientation === 'vertical' || dividers.orientation === 'both')) {
      slotRow.push(
        <div 
          key={`vdivider-left-${rowIndex}`} 
          className="vertical-shelf-divider shelf-side-left" 
          style={{
            width: `${dividers.thickness}px`,
            backgroundColor: dividers.color,
            backgroundImage: `url(${shelfTexture})`,
            opacity: dividers.opacity,
            height: `${dividers.height}px`
          }} 
        />
      );
    }

    for (let col = 0; col < columns; col++) {
      const position = rowIndex * columns + col;

      // Add vertical divider if needed and if it's not the first column
      if (dividers.enabled && (dividers.orientation === 'vertical' || dividers.orientation === 'both') && col > 0 && col % dividers.booksPerSection === 0) {
        slotRow.push(
          <div 
            key={`vdivider-${rowIndex}-${col}`} 
            style={{
              width: `${dividers.thickness}px`,
              backgroundColor: dividers.color,
              backgroundImage: `url(${shelfTexture})`,
              opacity: dividers.opacity,
              height: `${dividers.height}px`
            }} 
            className="vertical-shelf-divider" 
          />
        );
      }
      slotRow.push(<BookSlot key={`slot-${position}`} position={position} />);
    }

    // Add right side divider (bookend)
    if (dividers.enabled && (dividers.orientation === 'vertical' || dividers.orientation === 'both')) {
      slotRow.push(
        <div 
          key={`vdivider-right-${rowIndex}`} 
          className="vertical-shelf-divider shelf-side-right" 
          style={{
            width: `${dividers.thickness}px`,
            backgroundColor: dividers.color,
            backgroundImage: `url(${shelfTexture})`,
            opacity: dividers.opacity,
            height: `${dividers.height}px`
          }} 
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
  const shelfTexture = shelf?.textureImage || (useRealisticStyle ? '/lovable-uploads/7a437784-0910-4719-b52b-6564c3004ebe.png' : '/textures/default/wood.jpg');
  
  // Updated to not adjust the row height based on divider height
  return (
    <div 
      className={`shelf-row flex flex-col w-full relative ${useRealisticStyle ? 'realistic-shelf' : ''}`}
      style={{
        "--divider-height": `${shelfStyling?.dividers?.height || 200}px`,
        "--divider-thickness": `${shelfStyling?.dividers?.thickness || 6}px`,
        "--divider-color": shelfStyling?.dividers?.color || '#714621',
        "--divider-opacity": shelfStyling?.dividers?.opacity || 1,
      } as React.CSSProperties}
    >
      {/* Shelf back panel for realistic look */}
      <div className="bookshelf-back-panel" style={{
        backgroundColor: shelfStyling?.color || '#7c5738',
        backgroundImage: `url(${shelfTexture})`,
        backgroundSize: '100% 100%',
        opacity: 0.8,
        filter: 'brightness(0.6)',
        zIndex: 1 // Lower z-index for background
      }} />
        
      {/* Render books and dividers */}
      {renderSlots()}
        
      {/* Add horizontal divider if needed and it's not the last row */}
      {shelfStyling?.dividers?.enabled && (shelfStyling.dividers.orientation === 'horizontal' || shelfStyling.dividers.orientation === 'both') && rowIndex < shelf?.rows - 1 && (rowIndex + 1) % (shelfStyling.dividers.booksPerRow || 1) === 0 && 
        <div className="horizontal-shelf-divider" style={{
          height: `${shelfStyling.dividers.thickness}px`,
          backgroundColor: shelfStyling.dividers.color,
          backgroundImage: `url(${shelfTexture})`,
          opacity: shelfStyling.dividers.opacity,
          width: '100%',
          position: 'relative',
          zIndex: 5
        }} />
      }
        
      {/* Shelf */}
      <div className="wood-shelf" style={{
        height: `${shelfStyling?.thickness || 20}px`,
        backgroundImage: `url(${shelfTexture})`,
        backgroundColor: shelfStyling?.color || '#7c5738',
        opacity: shelfStyling?.opacity || 1,
        boxShadow: useRealisticStyle ? '0 6px 10px rgba(0,0,0,0.4)' : '0px 4px 6px -2px rgba(0,0,0,0.3)',
        zIndex: 5
      }} />
    </div>
  );
};

export default ShelfRow;
