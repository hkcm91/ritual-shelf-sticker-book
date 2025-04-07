
import React from 'react';
import { useBookshelfStore } from '@/store/bookshelfStore';

const BookshelfPreview: React.FC = () => {
  const { shelfStyling } = useBookshelfStore();
  
  // Determine number of shelves to display in preview
  const shelfCount = 2;
  
  return (
    <div className="relative w-full rounded overflow-hidden border shadow-sm" style={{ height: '140px' }}>
      <div 
        className="preview-container h-full w-full"
        style={{
          backgroundColor: 'var(--container-bg)',
          backgroundImage: 'var(--container-bg-image)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 'var(--container-opacity)',
          borderWidth: 'var(--container-border-width)',
          borderStyle: 'var(--container-border-style)',
          borderColor: 'var(--container-border-color)',
          borderRadius: 'var(--container-border-radius)',
          padding: 'var(--container-padding)',
        }}
      >
        <div className="flex flex-col h-full justify-between">
          {/* Generate preview shelves */}
          {Array.from({ length: shelfCount }).map((_, index) => (
            <div key={`preview-shelf-${index}`} className="relative">
              {/* Books row representation */}
              <div className="flex gap-1 mb-1 px-1">
                {Array.from({ length: 6 }).map((_, bookIndex) => (
                  <div 
                    key={`preview-book-${bookIndex}`}
                    className="h-8 rounded-t"
                    style={{ 
                      width: '16%',
                      backgroundColor: `hsl(${(bookIndex * 60) % 360}, 70%, 60%)` 
                    }}
                  />
                ))}
              </div>
              
              {/* Shelf */}
              <div 
                className="w-full"
                style={{
                  height: 'var(--shelf-thickness)',
                  backgroundColor: 'var(--shelf-color)',
                  backgroundImage: 'var(--shelf-texture)',
                  backgroundSize: 'cover',
                  opacity: 'var(--shelf-opacity)',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
                }}
              />
              
              {/* Render dividers if enabled */}
              {shelfStyling?.dividers?.enabled && (
                <div className="absolute top-0 bottom-0 left-0 right-0 pointer-events-none">
                  <div className="flex h-full justify-between">
                    {shelfStyling.dividers.orientation !== 'horizontal' && 
                     Array.from({ length: Math.floor(6 / (shelfStyling.dividers.booksPerSection || 3)) }).map((_, divIndex) => (
                      <div 
                        key={`preview-divider-${divIndex}`}
                        className="h-full"
                        style={{
                          width: 'var(--divider-thickness)',
                          backgroundColor: 'var(--divider-color)',
                          backgroundImage: 'var(--divider-bg-image)',
                          backgroundSize: 'cover',
                          opacity: 'var(--divider-opacity)',
                          marginLeft: `${(divIndex + 1) * (shelfStyling.dividers.booksPerSection || 3) * 16.6}%`,
                          position: 'absolute',
                          top: 0,
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookshelfPreview;
