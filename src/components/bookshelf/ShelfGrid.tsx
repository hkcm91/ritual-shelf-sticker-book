
import React from 'react';
import { useBookshelfStore } from '@/store/bookshelfStore';
import BookSlot from '@/components/BookSlot';

interface ShelfGridProps {
  shelfId: string;
}

const ShelfGrid: React.FC<ShelfGridProps> = ({ shelfId }) => {
  const { shelves, books } = useBookshelfStore();
  const shelf = shelves[shelfId];
  
  if (!shelf) {
    return <div>Shelf not found</div>;
  }
  
  // Create a 2D grid based on rows and columns
  const createGrid = () => {
    const grid = [];
    let position = 0;
    
    for (let row = 0; row < shelf.rows; row++) {
      const rowItems = [];
      for (let col = 0; col < shelf.columns; col++) {
        rowItems.push(
          <BookSlot 
            key={`${shelfId}-${position}`} 
            position={position} 
          />
        );
        position++;
      }
      grid.push(
        <div key={`row-${row}`} className="flex items-center justify-center my-2">
          {rowItems}
        </div>
      );
    }
    
    return grid;
  };
  
  return (
    <div className="shelf-grid" style={{ 
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--shelf-thickness, 20px)'
    }}>
      {createGrid()}
    </div>
  );
};

export default ShelfGrid;
