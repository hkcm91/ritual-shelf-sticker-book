
import React from 'react';
import { useBookshelfStore, BookData } from '../store/bookshelfStore';

type BookProps = {
  data: BookData;
};

const Book: React.FC<BookProps> = ({ data }) => {
  const { openModal, setDraggedBook } = useBookshelfStore();
  
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('bookId', data.id);
    e.dataTransfer.effectAllowed = 'move';
    setDraggedBook(data.id);
  };
  
  const handleDragEnd = () => {
    setDraggedBook(null);
  };
  
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    openModal(data.id);
  };
  
  return (
    <div
      className="relative w-full h-full rounded bg-bookshelf-wood flex items-center justify-center text-white text-xs font-bold text-center cursor-grab z-10 shadow-md transition-transform duration-200 hover:scale-105"
      style={{ 
        backgroundImage: `url(${data.coverURL})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={handleClick}
    >
      <div 
        className="absolute bottom-0 left-0 h-1 bg-green-500"
        style={{ width: `${data.progress}%` }}
      ></div>
    </div>
  );
};

export default Book;
