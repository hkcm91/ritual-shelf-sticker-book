
import React from 'react';
import { BookData } from '../store/bookshelfStore';
import { useBookInteractions } from '../hooks/useBookInteractions';

type BookProps = {
  data: BookData;
};

const Book: React.FC<BookProps> = ({ data }) => {
  const { handleDragStart, handleDragEnd, handleClick } = useBookInteractions(data.id);
  
  // Don't render hidden books or items that should be stickers
  if (data.hidden || data.isSticker) return null;
  
  // Check if coverURL is valid
  const hasCover = data.coverURL && data.coverURL !== '';
  
  return (
    <div
      className="relative w-full h-full rounded bg-bookshelf-wood flex items-center justify-center text-white text-xs font-bold text-center cursor-grab z-10 shadow-md transition-transform duration-200 hover:scale-105"
      style={{ 
        backgroundImage: hasCover ? `url(${data.coverURL})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={handleClick}
    >
      {!hasCover && (
        <div className="text-gray-400 text-xs">No cover</div>
      )}
      <div 
        className="absolute bottom-0 left-0 h-1 bg-green-500"
        style={{ width: `${data.progress}%` }}
      ></div>
    </div>
  );
};

export default Book;
