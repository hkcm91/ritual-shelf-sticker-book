
import React from 'react';
import { BookData } from '../store/bookshelfStore';
import { useBookInteractions } from '../hooks/useBookInteractions';
import { BookCover } from './bookslot';

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
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={handleClick}
      style={{ 
        backgroundColor: hasCover ? 'transparent' : '#a47148'
      }}
    >
      <BookCover coverURL={data.coverURL} progress={data.progress} />
    </div>
  );
};

export default Book;
