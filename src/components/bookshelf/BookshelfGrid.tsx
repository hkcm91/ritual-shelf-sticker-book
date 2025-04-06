
import React, { useEffect } from 'react';
import { useBookshelfStore } from '../../store/bookshelfStore';
import ShelfRow from './ShelfRow';
import StorageUsage from '../StorageUsage';

const BookshelfGrid: React.FC = () => {
  const { activeShelfId, shelves, zoomLevel } = useBookshelfStore();
  const activeShelf = shelves[activeShelfId];
  
  if (!activeShelf) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-lg text-gray-500">
          No shelf selected. Create a new shelf to get started.
        </p>
      </div>
    );
  }
  
  const { rows, columns } = activeShelf;
  
  // Generate grid rows
  const renderGrid = () => {
    const grid = [];
    
    for (let row = 0; row < rows; row++) {
      grid.push(
        <ShelfRow
          key={`row-${row}`}
          rowIndex={row}
          columns={columns}
        />
      );
    }
    
    return grid;
  };
  
  return (
    <div 
      className="bookshelf-wrapper p-4 md:p-8 overflow-auto max-w-full w-full"
      style={{ 
        backgroundColor: 'var(--page-bg)',
        backgroundImage: 'var(--page-bg-image)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div 
        className="bookshelf-container relative flex flex-col items-center rounded-md p-6 shadow-lg max-w-full mx-auto transform-gpu"
        style={{ 
          transform: `scale(${zoomLevel})`,
          transformOrigin: 'top center',
          width: 'max-content'
        }}
      >
        {/* Add storage usage indicator */}
        <div className="absolute bottom-1 right-1 w-48 z-10 bg-white/90 rounded shadow">
          <StorageUsage />
        </div>
        
        {renderGrid()}
      </div>
    </div>
  );
};

export default BookshelfGrid;
