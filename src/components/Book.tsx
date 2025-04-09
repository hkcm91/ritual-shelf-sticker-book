
import React, { useState } from 'react';
import { useBookshelfStore, BookData } from '../store/bookshelfStore';
import { toast } from 'sonner';

type BookProps = {
  data: BookData;
};

const Book: React.FC<BookProps> = ({ data }) => {
  const { openModal, setDraggedBook } = useBookshelfStore();
  const [isDragging, setIsDragging] = useState(false);
  
  if (!data || data.hidden || data.isSticker) return null;
  
  const handleDragStart = (e: React.DragEvent) => {
    console.log("[Book] Drag started for book:", data.id);
    
    try {
      // Set text data for compatibility with all browsers
      e.dataTransfer.setData('text/plain', data.id);
      e.dataTransfer.effectAllowed = 'move';
      
      // Set the dragged book in store
      setDraggedBook(data.id);
      setIsDragging(true);
      
      // Add visual feedback
      e.currentTarget.classList.add('dragging');
    } catch (error) {
      console.error("[Book] Error in drag start:", error);
    }
  };
  
  const handleDragEnd = (e: React.DragEvent) => {
    console.log("[Book] Drag ended");
    
    // Reset state
    setDraggedBook(null);
    setIsDragging(false);
    
    // Remove visual feedback
    e.currentTarget.classList.remove('dragging');
    
    e.preventDefault();
  };
  
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    console.log("[Book] Book clicked:", data.id);
    
    // Add a slight delay to ensure click event is not conflicting with other events
    setTimeout(() => {
      openModal(data.id);
    }, 50);
  };
  
  return (
    <div
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
    >
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
