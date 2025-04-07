
import React, { useEffect } from 'react';

type BookCoverProps = {
  coverURL?: string;
  progress?: number;
};

const BookCover: React.FC<BookCoverProps> = ({ coverURL, progress = 0 }) => {
  // Check if coverURL is valid and not empty
  const hasCover = coverURL && coverURL.trim() !== '';

  // Enhanced debugging
  useEffect(() => {
    console.log("BookCover mounted with URL:", hasCover ? "valid URL present" : "missing URL");
    if (!hasCover) {
      console.warn("BookCover missing valid URL");
    }
  }, [hasCover, coverURL]);

  // If URL is very large, only log the beginning and length
  const debugURL = coverURL ? 
    `${coverURL.substring(0, 30)}... (${coverURL.length} chars)` : 
    'undefined';
  
  console.log("Rendering BookCover component, has valid cover:", hasCover, debugURL);

  return (
    <div className="w-full h-full relative">
      {hasCover ? (
        <div 
          className="w-full h-full absolute inset-0"
          style={{
            backgroundImage: `url("${coverURL}")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            width: '100%',
            height: '100%',
            opacity: 1, // Force opacity
            display: 'block' // Force display
          }}
        >
          {/* Empty div to receive click events */}
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-amber-800 rounded">
          <span className="text-amber-200 text-sm font-medium">No cover</span>
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
