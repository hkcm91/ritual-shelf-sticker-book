
import React from 'react';
import { BookData } from '../store/bookshelfStore';
import { useBookInteractions } from '../hooks/useBookInteractions';
import BookCover from './bookslot/BookCover';

type BookProps = {
  data: BookData;
};

const Book: React.FC<BookProps> = ({ data }) => {
  const { handleDragStart, handleDragEnd, handleClick } = useBookInteractions(data.id);
  
  // Don't render hidden books or items that should be stickers
  if (data.hidden || data.isSticker) return null;
  
  return (
    <div
      className="relative w-full h-full rounded shadow-md transition-transform duration-200 hover:scale-105 cursor-grab"
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={handleClick}
    >
      <BookCover coverURL={data.coverURL} progress={data.progress} />
    </div>
  );
};

export default Book;
