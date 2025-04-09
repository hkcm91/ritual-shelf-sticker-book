
import React, { useState, useEffect, useRef } from 'react';
import { useBookshelfStore, BookData } from '../store/bookshelfStore';
import { toast } from 'sonner';

type BookProps = {
  data: BookData;
};

const Book: React.FC<BookProps> = ({ data }) => {
  const { openModal, setDraggedBook } = useBookshelfStore();
  const [isDragging, setIsDragging] = useState(false);
  const bookRef = useRef<HTMLDivElement>(null);
  const dragTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Clean up drag state if component unmounts while dragging
  useEffect(() => {
    return () => {
      if (isDragging) {
        console.log(`[Book] Cleaning up drag state on unmount for book ${data.id}`);
        setDraggedBook(null);
        setIsDragging(false);
      }
      
      if (dragTimeoutRef.current) {
        clearTimeout(dragTimeoutRef.current);
      }
    };
  }, [isDragging, setDraggedBook, data.id]);
  
  if (!data || data.hidden || data.isSticker) return null;
  
  const handleDragStart = (e: React.DragEvent) => {
    console.log(`[Book] Drag started for book: ${data.id}, title: ${data.title || 'Untitled'}`);
    
    try {
      // Set text data for compatibility with all browsers
      e.dataTransfer.setData('text/plain', data.id);
      e.dataTransfer.effectAllowed = 'move';
      
      // Try to set a drag image if possible
      if (bookRef.current) {
        try {
          e.dataTransfer.setDragImage(bookRef.current, 10, 10);
        } catch (err) {
          console.warn("[Book] Could not set drag image:", err);
        }
      }
      
      // Set the dragged book in store
      setDraggedBook(data.id);
      setIsDragging(true);
      
      // Add visual feedback
      e.currentTarget.classList.add('dragging');
      
      // Set safety timeout to reset state if dragEnd doesn't fire
      dragTimeoutRef.current = setTimeout(() => {
        console.log(`[Book] Drag safety timeout triggered for book ${data.id}`);
        handleDragEnd(e);
      }, 5000);
    } catch (error) {
      console.error(`[Book] Error in drag start for book ${data.id}:`, error);
      toast.error("Failed to start dragging");
    }
  };
  
  const handleDragEnd = (e: React.DragEvent) => {
    console.log(`[Book] Drag ended for book ${data.id}`);
    
    // Reset state
    setDraggedBook(null);
    setIsDragging(false);
    
    // Remove visual feedback
    e.currentTarget.classList.remove('dragging');
    
    // Clear safety timeout
    if (dragTimeoutRef.current) {
      clearTimeout(dragTimeoutRef.current);
      dragTimeoutRef.current = null;
    }
    
    e.preventDefault();
  };
  
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    console.log(`[Book] Book clicked: ${data.id}, title: ${data.title || 'Untitled'}`);
    openModal(data.id);
  };
  
  return (
    <div
      ref={bookRef}
      className={`book relative w-full h-full rounded bg-bookshelf-wood flex items-center justify-center text-white text-xs font-bold text-center cursor-grab z-10 shadow-md transition-transform duration-200 hover:scale-105 ${isDragging ? 'opacity-70 scale-95' : ''}`}
      style={{ 
        backgroundImage: data.coverURL ? `url(${data.coverURL})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
      draggable={true}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={handleClick}
      data-book-id={data.id}
      data-position={data.position}
    >
      {!data.coverURL && (data.title || 'Untitled')}
      
      {typeof data.progress === 'number' && (
        <div 
          className="absolute bottom-0 left-0 h-1 bg-green-500"
          style={{ width: `${data.progress}%` }}
        ></div>
      )}
    </div>
  );
};

export default Book;
