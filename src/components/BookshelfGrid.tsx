
import React from 'react';
import { useBookshelfStore } from '../store/bookshelfStore';
import BookSlot from './BookSlot';

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
  
  // Generate grid cells
  const renderGrid = () => {
    const grid = [];
    
    for (let row = 0; row < rows; row++) {
      // First add the book slots for this row
      const slots = [];
      for (let col = 0; col < columns; col++) {
        const position = row * columns + col;
        slots.push(
          <BookSlot key={`slot-${row}-${col}`} position={position} />
        );
      }
      
      grid.push(
        <div key={`row-${row}`} className="flex flex-col mb-8">
          <div className="flex justify-center space-x-2">
            {slots}
          </div>
          <div 
            className="wood-shelf h-10 bg-shelf-texture bg-repeat-x bg-bottom bg-contain" 
            style={{ 
              marginLeft: '-8px',
              marginRight: '-8px'
            }}
          />
        </div>
      );
    }
    
    return grid;
  };
  
  return (
    <div 
      className="bookshelf-wrapper p-4 md:p-8 overflow-auto max-w-full w-full"
    >
      <div 
        className="bookshelf-container flex flex-col items-center bg-wood-texture bg-cover rounded-md p-6 shadow-lg max-w-full mx-auto transform-gpu"
        style={{ 
          transform: `scale(${zoomLevel})`,
          transformOrigin: 'top center',
          width: 'max-content'
        }}
      >
        {renderGrid()}
      </div>
    </div>
  );
};

export default BookshelfGrid;
