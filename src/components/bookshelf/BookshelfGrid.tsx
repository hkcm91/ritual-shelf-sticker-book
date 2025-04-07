
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
      <div className="bookshelf-rows relative z-10">
        {renderShelfRows()}
      </div>
    </div>
  );
};

export default BookshelfGrid;
