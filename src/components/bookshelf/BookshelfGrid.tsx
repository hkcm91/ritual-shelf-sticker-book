
import React from 'react';
import ShelfRow from './ShelfRow';
import { useBookshelfStore } from '../../store/bookshelfStore';
import { useThemeApplication } from '@/hooks/theme/useThemeApplication';

const BookshelfGrid: React.FC = () => {
  const { 
    activeShelfId, 
    shelfStyling,
    activeTheme,
    shelves
  } = useBookshelfStore();
  
  // Apply theme styles
  useThemeApplication();
  
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
