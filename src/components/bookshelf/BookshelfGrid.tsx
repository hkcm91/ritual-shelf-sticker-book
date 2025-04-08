
import React, { useEffect } from 'react';
import ShelfRow from './ShelfRow';
import { useBookshelfStore } from '../../store/bookshelfStore';
import { useThemeApplication } from '@/hooks/theme/useThemeApplication';

const BookshelfGrid: React.FC = () => {
  const { 
    activeShelfId, 
    shelfStyling,
    activeTheme,
    shelves,
    initializeDefaultShelf
  } = useBookshelfStore();
  
  // Apply theme styles
  useThemeApplication();
  
  // Ensure we have a default shelf
  useEffect(() => {
    // If there are no shelves, initialize a default shelf
    if (!shelves || Object.keys(shelves).length === 0) {
      console.log("BookshelfGrid: Initializing default shelf");
      initializeDefaultShelf();
    }
  }, [shelves, initializeDefaultShelf]);
  
  // Get the current shelf data to access rows and columns
  const currentShelf = activeShelfId ? shelves[activeShelfId] : null;
  console.log("BookshelfGrid - currentShelf:", currentShelf, "activeShelfId:", activeShelfId);
  
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

  return (
    <div 
      className="bookshelf-container relative"
      /* All styles now controlled by CSS variables in layout.css */
    >
      <div className="bookshelf-rows relative z-10">
        {renderShelfRows()}
      </div>
    </div>
  );
};

export default BookshelfGrid;
