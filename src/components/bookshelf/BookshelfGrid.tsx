
import React, { useEffect } from 'react';
import ShelfRow from './ShelfRow';
import { useBookshelfStore } from '../../store/bookshelfStore';
import { useThemeApplication } from '@/hooks/theme/useThemeApplication';

const BookshelfGrid: React.FC = () => {
  const activeShelfId = useBookshelfStore(state => state.activeShelfId);
  const shelves = useBookshelfStore(state => state.shelves);
  const initializeDefaultShelf = useBookshelfStore(state => state.initializeDefaultShelf);
  
  // Apply theme styles - this should be a stable reference
  useThemeApplication();
  
  // Ensure we have a default shelf - only run once on mount
  useEffect(() => {
    // If there are no shelves, initialize a default shelf
    if (!shelves || Object.keys(shelves).length === 0) {
      console.log("BookshelfGrid: Initializing default shelf");
      initializeDefaultShelf();
    }
  }, []);
  
  // Get the current shelf data to access rows and columns
  const currentShelf = activeShelfId ? shelves[activeShelfId] : null;
  console.log("BookshelfGrid - currentShelf:", currentShelf, "activeShelfId:", activeShelfId);
  
  const columnsPerRow = currentShelf?.columns || 4;
  const rowsPerShelf = currentShelf?.rows || 2;
  
  // Generate rows for the grid
  const renderShelfRows = React.useMemo(() => {
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
  }, [rowsPerShelf, columnsPerRow]);
  
  return (
    <div className="bookshelf-container relative">
      <div className="bookshelf-rows relative z-10">
        {renderShelfRows}
      </div>
    </div>
  );
};

export default BookshelfGrid;
