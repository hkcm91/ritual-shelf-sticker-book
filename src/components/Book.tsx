
import React, { useState } from 'react';
import { useBookshelfStore, BookData } from '../store/bookshelfStore';

type BookProps = {
  data: BookData;
};

const Book: React.FC<BookProps> = ({ data }) => {
  const { openModal, setDraggedBook } = useBookshelfStore();
  const [isDragging, setIsDragging] = useState(false);
  
  // Don't render hidden books or items that should be stickers
  if (!data || data.hidden || data.isSticker) return null;
  
  const handleDragStart = (e: React.DragEvent) => {
    try {
      console.log("[Book] Drag started for book:", data.id);
      e.dataTransfer.setData('text/plain', data.id);
      e.dataTransfer.effectAllowed = 'move';
      
      // Set a dragging image (optional)
      if (e.target instanceof HTMLElement) {
        const rect = e.target.getBoundingClientRect();
        e.dataTransfer.setDragImage(e.target, rect.width / 2, rect.height / 2);
      }
      
      // Set the dragged book in the store
      setDraggedBook(data.id);
      setIsDragging(true);
    } catch (error) {
      console.error("[Book] Error in drag start:", error);
    }
  };
  
  const handleDragEnd = () => {
    try {
      console.log("[Book] Drag ended");
      setDraggedBook(null);
      setIsDragging(false);
    } catch (error) {
      console.error("[Book] Error in drag end:", error);
    }
  };
  
  const handleClick = (e: React.MouseEvent) => {
    try {
      e.stopPropagation();
      openModal(data.id);
    } catch (error) {
      console.error("[Book] Error handling click:", error);
    }
  };
  
  return (
    <div
      className={`book relative w-full h-full rounded bg-bookshelf-wood flex items-center justify-center text-white text-xs font-bold text-center cursor-grab z-10 shadow-md transition-transform duration-200 hover:scale-105 ${isDragging ? 'dragging opacity-70 scale-95' : ''}`}
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
