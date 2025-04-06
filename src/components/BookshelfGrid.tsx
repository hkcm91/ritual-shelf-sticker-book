
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
        <div key={`row-${row}`} className="flex flex-col">
          <div className="flex gap-3 mb-1">{slots}</div>
          <div className="shelf mb-3"></div>
        </div>
      );
    }
    
    return grid;
  };
  
  return (
    <div 
      className="bookshelf-wrapper p-4 md:p-8"
      style={{ transform: `scale(${zoomLevel})` }}
    >
      <div className="bookshelf-container flex flex-col bg-wood-texture bg-cover rounded-md p-4 shadow-lg">
        {renderGrid()}
      </div>
    </div>
  );
};

export default BookshelfGrid;
