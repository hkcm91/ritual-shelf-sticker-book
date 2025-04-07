
import React from 'react';

type BookCoverProps = {
  coverURL?: string;
  progress?: number;
};

const BookCover: React.FC<BookCoverProps> = ({ coverURL, progress = 0 }) => {
  // Check if coverURL is valid and not empty
  const hasCover = coverURL && coverURL.trim() !== '';

  // For debugging
  console.log("Rendering book cover with URL:", coverURL ? coverURL.substring(0, 30) + '...' : 'undefined', hasCover ? "valid" : "invalid");

  return (
    <div className="w-full h-full">
      {hasCover ? (
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `url(${coverURL})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            height: '100%',
            width: '100%'
          }}
        >
          {/* Empty div that takes full space to ensure the background shows */}
          <div className="w-full h-full"></div>
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-amber-800">
          <span className="text-amber-200 text-xs">No cover</span>
        </div>
      )}
      
      {/* Progress bar */}
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
