
import React from 'react';
import { BookData } from '@/store/bookshelfStore';

type BookCoverProps = {
  coverURL?: string;
  progress?: number;
};

const BookCover: React.FC<BookCoverProps> = ({ coverURL, progress = 0 }) => {
  // Check if coverURL is valid
  const hasCover = coverURL && coverURL !== '';

  return (
    <>
      {!hasCover && (
        <div className="text-gray-400 text-xs">No cover</div>
      )}
      {typeof progress === 'number' && progress > 0 && (
        <div 
          className="absolute bottom-0 left-0 h-1 bg-green-500"
          style={{ width: `${progress}%` }}
        ></div>
      )}
    </>
  );
};

export default BookCover;
