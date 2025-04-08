
import React, { memo } from 'react';
import BookSlot from '../BookSlot';
import { useBookshelfStore } from '../../store/bookshelfStore';
import { ShelfData } from '../../store/types';
import VerticalDivider from './dividers/VerticalDivider';
import HorizontalDivider from './dividers/HorizontalDivider';
import ShelfWood from './ShelfWood';
import BookshelfBackPanel from './BookshelfBackPanel';
import { shallow } from 'zustand/shallow';

type ShelfRowProps = {
  rowIndex: number;
  columns: number;
};

const ShelfRow: React.FC<ShelfRowProps> = ({
  rowIndex,
  columns
}) => {
  // Properly type the selector function to return a well-defined object type
  const {
    activeShelfId,
    activeShelf,
    shelfStyling,
    activeTheme
  } = useBookshelfStore((state) => ({
    activeShelfId: state.activeShelfId,
    activeShelf: state.shelves[state.activeShelfId] as ShelfData,
    shelfStyling: state.shelfStyling,
    activeTheme: state.activeTheme
  }), shallow);
  
  // Determine if we should use realistic shelf styling
  const useRealisticStyle = activeTheme === 'default' || activeTheme === 'custom';

  // Get shelf texture or use default
  const shelfTexture = activeShelf?.textureImage || (useRealisticStyle ? '/lovable-uploads/7a437784-0910-4719-b52b-6564c3004ebe.png' : '/textures/default/wood.jpg');

  // Generate slots for this row - memoize the rendering logic
  const renderSlots = React.useMemo(() => {
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

    // Add the book slots with vertical dividers if needed
    const slotRow = [];

    // Add left side divider (bookend)
    if (dividers.enabled && (dividers.orientation === 'vertical' || dividers.orientation === 'both')) {
      slotRow.push(
        <VerticalDivider 
          key={`vdivider-left-${rowIndex}`}
          thickness={dividers.thickness}
          height={dividers.height}
          color={dividers.color}
          opacity={dividers.opacity}
          textureUrl={shelfTexture}
          className="shelf-side-left"
          isSide
          side="left"
        />
      );
    }

    for (let col = 0; col < columns; col++) {
      const position = rowIndex * columns + col;

      // Add vertical divider if needed and if it's not the first column
      if (dividers.enabled && (dividers.orientation === 'vertical' || dividers.orientation === 'both') && col > 0 && col % dividers.booksPerSection === 0) {
        slotRow.push(
          <VerticalDivider 
            key={`vdivider-${rowIndex}-${col}`}
            thickness={dividers.thickness}
            height={dividers.height}
            color={dividers.color}
            opacity={dividers.opacity}
            textureUrl={shelfTexture}
          />
        );
      }
      slotRow.push(<BookSlot key={`slot-${position}`} position={position} />);
    }

    // Add right side divider (bookend)
    if (dividers.enabled && (dividers.orientation === 'vertical' || dividers.orientation === 'both')) {
      slotRow.push(
        <VerticalDivider 
          key={`vdivider-right-${rowIndex}`}
          thickness={dividers.thickness}
          height={dividers.height}
          color={dividers.color}
          opacity={dividers.opacity}
          textureUrl={shelfTexture}
          className="shelf-side-right"
          isSide
          side="right"
        />
      );
    }

    // Add the row of slots
    slots.push(
      <div 
        key={`slot-row-${rowIndex}`} 
        className="flex justify-start items-stretch flex-nowrap gap-2 p-2 relative z-2"
        style={{
          minHeight: dividers.enabled ? `${Math.max(220, dividers.height)}px` : '220px',
          alignItems: 'flex-end',
          paddingBottom: '8px'
        }}
      >
        {slotRow}
      </div>
    );
    
    return slots;
  }, [rowIndex, columns, shelfStyling, shelfTexture]);
  
  return (
    <div 
      className={`shelf-row flex flex-col w-full relative ${useRealisticStyle ? 'realistic-shelf' : ''}`}
      style={{
        "--divider-height": `${shelfStyling?.dividers?.height || 200}px`,
        "--divider-thickness": `${shelfStyling?.dividers?.thickness || 6}px`,
        "--divider-color": shelfStyling?.dividers?.color || '#714621',
        "--divider-opacity": shelfStyling?.dividers?.opacity || 1,
        minHeight: shelfStyling?.dividers?.enabled ? 
          `${Math.max(260, shelfStyling.dividers.height + 40)}px` : '240px',
      } as React.CSSProperties}
    >
      {/* Shelf back panel for realistic look */}
      <BookshelfBackPanel 
        color={shelfStyling?.color || '#7c5738'}
        textureUrl={shelfTexture}
      />
        
      {/* Render books and dividers */}
      {renderSlots}
        
      {/* Add horizontal divider if needed and it's not the last row */}
      {shelfStyling?.dividers?.enabled && 
       (shelfStyling.dividers.orientation === 'horizontal' || shelfStyling.dividers.orientation === 'both') && 
       rowIndex < activeShelf?.rows - 1 && 
       (rowIndex + 1) % (shelfStyling.dividers.booksPerRow || 1) === 0 && (
        <HorizontalDivider 
          thickness={shelfStyling.dividers.thickness}
          color={shelfStyling.dividers.color}
          opacity={shelfStyling.dividers.opacity}
          textureUrl={shelfTexture}
        />
      )}
        
      {/* Shelf wood */}
      <ShelfWood 
        thickness={shelfStyling?.thickness || 20}
        color={shelfStyling?.color || '#7c5738'}
        opacity={shelfStyling?.opacity || 1}
        textureUrl={shelfTexture}
        useRealisticStyle={useRealisticStyle}
      />
    </div>
  );
};

// Wrap in memo to prevent unnecessary re-renders
export default memo(ShelfRow);
