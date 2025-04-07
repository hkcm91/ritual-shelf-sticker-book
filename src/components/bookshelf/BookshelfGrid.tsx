
import React from 'react';
import ShelfRow from './ShelfRow';
import { useBookshelfStore } from '../../store/bookshelfStore';

const BookshelfGrid: React.FC = () => {
  const { 
    activeShelfId, 
    container, 
    shelfStyling,
    activeTheme,
    shelves
  } = useBookshelfStore();
  
  // Get the current shelf data to access rows and columns
  const currentShelf = activeShelfId ? shelves[activeShelfId] : null;
  const columnsPerRow = currentShelf?.columns || 4;
  const rowsPerShelf = currentShelf?.rows || 2;
  
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
  
  // Get custom shelf texture or use default
  const shelfTexture = currentShelf?.textureImage || 
                      (useRealisticStyle ? '/lovable-uploads/7a437784-0910-4719-b52b-6564c3004ebe.png' : 
                      '/textures/default/wood.jpg');

  return (
    <div 
      className="bookshelf-container relative"
      style={{
        backgroundColor: container?.background || '#a47148',
        backgroundImage: container?.backgroundImage ? `url(${container.backgroundImage})` : 'none',
        opacity: container?.opacity || 1,
        boxShadow: 'inset 0 0 30px rgba(0, 0, 0, 0.3)',
        padding: `${container?.padding || 16}px`,
        borderRadius: `${container?.borderRadius || 8}px`,
        overflow: 'hidden'
      }}
    >
      {/* Add a frame border that matches dividers */}
      {shelfStyling?.dividers?.enabled && (
        <div 
          className="bookshelf-frame"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderWidth: `${dividers.thickness || 8}px`,
            borderColor: dividers.color || '#714621',
            backgroundImage: `url(${shelfTexture})`,
            backgroundSize: '100% 100%',
            opacity: dividers.opacity || 1,
            borderRadius: `${container?.borderRadius ? container.borderRadius - 4 : 4}px`,
            pointerEvents: 'none',
            zIndex: 20,
            boxShadow: 'inset 0 0 15px rgba(0,0,0,0.3)'
          }}
        ></div>
      )}
      
      <div className="bookshelf-rows relative z-10">
        {renderShelfRows()}
      </div>
    </div>
  );
};

export default BookshelfGrid;
