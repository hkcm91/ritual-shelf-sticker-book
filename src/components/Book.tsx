
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
      className="relative w-full h-full cursor-grab"
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={handleClick}
    >
      <div className="w-full h-full overflow-hidden rounded shadow-md transition-transform duration-200 hover:scale-105">
        <BookCover coverURL={data.coverURL} progress={data.progress} />
      </div>
    </div>
  );
};

export default Book;
