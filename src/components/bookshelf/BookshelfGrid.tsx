
import React, { useRef, useEffect } from 'react';
import { useBookshelfStore } from '../../store/bookshelfStore';
import ShelfRow from './ShelfRow';
import StorageUsage from '../StorageUsage';
import ShelfControls from '../ShelfControls';
import ZoomControls from '../ZoomControls';
import StickerCanvas from '../stickers/StickerCanvas';

const BookshelfGrid: React.FC = () => {
  const { activeShelfId, shelves, zoomLevel, adjustZoomLevel } = useBookshelfStore();
  const activeShelf = shelves[activeShelfId];
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Add wheel event listener for zooming
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // Only zoom when ctrl key is pressed
      if (e.ctrlKey) {
        e.preventDefault();
        // Zoom in or out based on wheel direction
        adjustZoomLevel(e.deltaY > 0 ? -0.05 : 0.05);
      }
    };
    
    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
    }
    
    return () => {
      if (container) {
        container.removeEventListener('wheel', handleWheel);
      }
    };
  }, [adjustZoomLevel]);
  
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
  
  return (
    <div 
      ref={containerRef}
      className="bookshelf-wrapper p-4 md:p-8 overflow-auto h-full w-full relative"
      style={{ 
        backgroundColor: 'var(--page-bg)',
        backgroundImage: 'var(--page-bg-image)',
        backgroundSize: 'var(--page-bg-size, cover)',
        backgroundPosition: 'var(--page-bg-position, center)',
        backgroundAttachment: 'var(--page-bg-attachment, fixed)'
      }}
    >
      {/* Shelf controls */}
      <div className="absolute top-4 right-4 z-10">
        <ShelfControls />
      </div>
      
      <div 
        className="bookshelf-container relative flex flex-col items-center rounded-md p-6 shadow-lg mx-auto overflow-visible"
        style={{ 
          transform: `scale(${zoomLevel})`,
          transformOrigin: 'top center',
          width: 'fit-content',
          minWidth: `${columns * 160}px`, // Ensure minimum width based on columns
          maxWidth: '100%',
          transition: 'transform 0.2s ease' // Smooth transition for zoom
        }}
      >
        {/* Add storage usage indicator */}
        <div className="absolute bottom-1 right-1 w-48 z-10 bg-white/90 rounded shadow">
          <StorageUsage />
        </div>
        
        {/* Add sticker canvas for floating stickers */}
        <StickerCanvas shelfId={activeShelfId} />
        
        <div className="grid-container w-full flex flex-col">
          {Array.from({ length: rows }).map((_, index) => (
            <ShelfRow
              key={`row-${index}`}
              rowIndex={index}
              columns={columns}
            />
          ))}
        </div>
      </div>
      
      {/* Add zoom controls at the bottom right */}
      <div className="fixed bottom-4 right-4 z-20">
        <ZoomControls />
      </div>
    </div>
  );
};

export default BookshelfGrid;
