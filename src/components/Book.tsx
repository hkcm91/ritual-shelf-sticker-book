
import React from 'react';
import { useBookshelfStore, BookData } from '../store/bookshelfStore';

type BookProps = {
  data: BookData;
};

const Book: React.FC<BookProps> = ({ data }) => {
  const { openModal, setDraggedBook } = useBookshelfStore();
  
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', data.id);
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
      className="book"
      style={{ backgroundImage: `url(${data.coverURL})` }}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={handleClick}
    >
      <div 
        className="progress-bar" 
        style={{ width: `${data.progress}%` }}
      ></div>
    </div>
  );
};

export default Book;
