
import React, { useEffect, useRef, useState } from 'react';
import ShelfRow from './ShelfRow';
import { useBookshelfStore } from '../../store/bookshelfStore';
import { useThemeApplication } from '@/hooks/theme/useThemeApplication';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useIsMobile } from '@/hooks/use-mobile';
import useGestureHandlers from '@/hooks/useGestureHandlers';

const BookshelfGrid: React.FC = () => {
  const activeShelfId = useBookshelfStore(state => state.activeShelfId);
  const shelves = useBookshelfStore(state => state.shelves);
  const initializeDefaultShelf = useBookshelfStore(state => state.initializeDefaultShelf);
  const zoomLevel = useBookshelfStore(state => state.zoomLevel);
  
  // State to track if currently dragging
  const [isDragging, setIsDragging] = useState(false);
  
  // Reference to track if initialization has occurred
  const initializedRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  
  // Apply theme styles
  useThemeApplication();
  
  // Set up gesture handlers
  const gestureHandlers = useGestureHandlers(containerRef);
  
  // Track dragging state for cursor style
  useEffect(() => {
    const handleMouseDown = () => setIsDragging(true);
    const handleMouseUp = () => setIsDragging(false);
    
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);
  
  // Ensure we have a default shelf - only run once on mount
  useEffect(() => {
    // If we already initialized, skip this effect
    if (initializedRef.current) return;
    
    // If there are no shelves, initialize a default shelf
    if (!shelves || Object.keys(shelves).length === 0) {
      console.log("BookshelfGrid: Initializing default shelf");
      initializeDefaultShelf();
    }
    
    // Mark as initialized to prevent future runs
    initializedRef.current = true;
  }, []);
  
  // Get the current shelf data to access rows and columns
  const currentShelf = activeShelfId ? shelves[activeShelfId] : null;
  
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
    <ScrollArea className="w-full h-full bookshelf-wrapper">
      <div 
        ref={containerRef}
        className="bookshelf-container relative mt-0"
        style={{
          transform: `scale(${zoomLevel})`,
          transformOrigin: 'top center',
          transition: 'transform 0.2s ease-out',
          width: `${isMobile ? 100 : 95}%`,
          margin: '0 auto',
          cursor: isDragging ? 'grabbing' : 'grab'
        }}
      >
        <div className="bookshelf-rows relative z-10">
          {renderShelfRows}
        </div>
      </div>
    </ScrollArea>
  );
};

export default BookshelfGrid;
