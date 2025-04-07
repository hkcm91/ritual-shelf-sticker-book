
import React from 'react';
import { useBookshelfStore } from '@/store/bookshelfStore';
import ShelfRow from './bookshelf/ShelfRow';

const BookshelfGrid: React.FC = () => {
  const { activeShelfId, shelves, container } = useBookshelfStore();
  
  if (!activeShelfId || !shelves[activeShelfId]) {
    return <div className="p-4 text-center">No bookshelf selected</div>;
  }
  
  const { rows, columns } = shelves[activeShelfId];
  
  // Apply container customization styles
  const containerStyles = {
    backgroundColor: container?.background || '#a47148',
    backgroundImage: container?.backgroundImage ? `url(${container.backgroundImage})` : 'none',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    opacity: container?.opacity !== undefined ? container.opacity : 1,
    borderWidth: `${container?.borderWidth || 0}px`,
    borderStyle: container?.borderStyle || 'solid',
    borderColor: container?.borderColor || '#e0e0e0',
    borderRadius: `${container?.borderRadius || 8}px`,
    padding: `${container?.padding || 16}px`,
  };
  
  return (
    <div 
      className="w-full h-full overflow-auto"
      style={containerStyles}
    >
      <div 
        className="bookshelf-grid flex flex-col"
        style={{ 
          width: `calc(${columns} * 160px + 2rem)`
        }}
      >
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <ShelfRow
            key={`row-${rowIndex}`}
            rowIndex={rowIndex}
            columns={columns}
          />
        ))}
      </div>
    </div>
  );
};

export default BookshelfGrid;
