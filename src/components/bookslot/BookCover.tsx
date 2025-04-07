
import React from 'react';

type BookCoverProps = {
  coverURL?: string;
  progress?: number;
};

const BookCover: React.FC<BookCoverProps> = ({ coverURL, progress = 0 }) => {
  // Check if coverURL is valid
  const hasCover = coverURL && coverURL !== '';

  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative">
      {hasCover ? (
        <div 
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: `url(${coverURL})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            borderRadius: '4px'
          }}
        />
      ) : (
        <div className="text-gray-400 text-xs">No cover</div>
      )}
      
      {typeof progress === 'number' && progress > 0 && (
        <div 
          className="absolute bottom-0 left-0 h-1 bg-green-500 z-10"
          style={{ width: `${progress}%` }}
        />
      )}
    </div>
  );
};

export default BookCover;
