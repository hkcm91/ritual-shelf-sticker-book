
import React, { useEffect } from 'react';
import { BookData } from '../store/bookshelfStore';
import { useBookInteractions } from '../hooks/useBookInteractions';
import BookCover from './bookslot/BookCover';

type BookProps = {
  data: BookData;
};

const Book: React.FC<BookProps> = ({ data }) => {
  const { handleDragStart, handleDragEnd, handleClick } = useBookInteractions(data.id);
  
  // Log when a book renders and its data
  useEffect(() => {
    console.log('Book component mounted for ID:', data.id);
    console.log('Book data:', {
      title: data.title,
      author: data.author,
      hasValidCoverURL: !!data.coverURL,
      coverURLLength: data.coverURL ? data.coverURL.length : 0,
      coverURLValue: data.coverURL ? `${data.coverURL.substring(0, 30)}...` : "undefined",
      position: data.position,
      hidden: data.hidden,
      isSticker: data.isSticker
    });
  }, [data]);
  
  // Skip rendering stickers
  if (data.isSticker) {
    console.log('Book not rendered - is sticker:', data.id);
    return null;
  }
  
  // Add safety check - if book is somehow marked as hidden, render a placeholder anyway
  // This ensures the book is still visible and clickable even if there's an issue
  const isHidden = data.hidden === true;
  
  return (
    <div
      className="relative w-full h-full cursor-grab"
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={handleClick}
      style={{ display: 'block', opacity: isHidden ? 0.5 : 1 }}
      data-book-id={data.id}
    >
      <div 
        className="w-full h-full overflow-hidden rounded shadow-md transition-transform duration-200 hover:scale-105"
        style={{ opacity: 1, display: 'block' }}
        data-has-cover={!!data.coverURL}
      >
        <BookCover 
          coverURL={data.coverURL} 
          progress={data.progress} 
        />
      </div>
    </div>
  );
};

export default Book;
