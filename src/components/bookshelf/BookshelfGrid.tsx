
import React from 'react';
import ShelfRow from './ShelfRow';
import { useBookshelfStore } from '../../store/bookshelfStore';

const BookshelfGrid: React.FC = () => {
  const { 
    columnsPerRow, 
    rowsPerShelf, 
    activeShelfId, 
    container, 
    shelfStyling,
    activeTheme
  } = useBookshelfStore();
  
  // Generate rows for the grid
  const renderShelfRows = () => {
    const rows = [];
    for (let i = 0; i < rowsPerShelf; i++) {
      rows.push(
        <ShelfRow 
          key={`row-${i}`} 
          rowIndex={i} 
          columns={columnsPerRow} 
        />
      );
    }
    return rows;
  };
  
  // Get divider settings for the frame
  const dividers = shelfStyling?.dividers || {
    thickness: 8,
    color: '#714621',
    opacity: 1
  };
  
  // Determine if we should use realistic shelf styling
  const useRealisticStyle = activeTheme === 'default' || activeTheme === 'custom';

  return (
    <div 
      className="bookshelf-container"
      style={{
        backgroundColor: container?.background || '#a47148',
        backgroundImage: container?.backgroundImage ? `url(${container.backgroundImage})` : 'none',
        opacity: container?.opacity || 1,
        boxShadow: 'inset 0 0 30px rgba(0, 0, 0, 0.2)',
        padding: `${container?.padding || 16}px`,
        borderRadius: `${container?.borderRadius || 8}px`,
        position: 'relative'
      }}
    >
      {/* Add a frame border that matches dividers */}
      {shelfStyling?.dividers?.enabled && (
        <div 
          className="bookshelf-frame"
          style={{
            borderWidth: `${dividers.thickness || 8}px`,
            borderColor: dividers.color || '#714621',
            opacity: dividers.opacity || 1,
            borderRadius: `${container?.borderRadius ? container.borderRadius - 4 : 4}px`
          }}
        ></div>
      )}
      
      <div className="bookshelf-rows">
        {renderShelfRows()}
      </div>
    </div>
  );
};

export default BookshelfGrid;
