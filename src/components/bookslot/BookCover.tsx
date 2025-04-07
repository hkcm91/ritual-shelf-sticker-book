
import React from 'react';

type BookCoverProps = {
  coverURL?: string;
  progress?: number;
};

const BookCover: React.FC<BookCoverProps> = ({ coverURL, progress = 0 }) => {
  // Check if coverURL is valid
  const hasCover = coverURL && coverURL !== '';

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden rounded-sm">
      {hasCover ? (
        <div 
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: `url(${coverURL})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />
      ) : (
        <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-amber-800">
          <div className="text-amber-200 text-xs">No cover</div>
        </div>
      )}
      
      {typeof progress === 'number' && progress > 0 && (
        <div 
          className="absolute bottom-0 left-0 right-0 h-1 bg-green-500 z-10"
          style={{ width: `${progress}%` }}
        />
      )}
    </div>
  );
};

export default BookCover;
