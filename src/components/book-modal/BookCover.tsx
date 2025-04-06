
import React from 'react';

type BookCoverProps = {
  coverURL?: string;
  className?: string;
};

const BookCover: React.FC<BookCoverProps> = ({ coverURL, className = "" }) => {
  if (!coverURL) return null;
  
  return (
    <div 
      className={`w-full h-40 bg-muted rounded-md bg-cover bg-center ${className}`} 
      style={{ backgroundImage: `url(${coverURL})` }}
    />
  );
};

export default BookCover;
