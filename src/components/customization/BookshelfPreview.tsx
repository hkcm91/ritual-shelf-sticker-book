
import React from 'react';

const BookshelfPreview: React.FC = () => {
  return (
    <div className="relative w-full rounded overflow-hidden border shadow-sm" style={{ height: '180px' }}>
      {/* Container with customizable properties */}
      <div 
        className="preview-container h-full w-full relative"
        style={{
          backgroundColor: 'var(--container-bg)',
          backgroundImage: 'var(--container-bg-image)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 'var(--container-opacity, 1)',
          borderWidth: 'var(--container-border-width, 0px)',
          borderStyle: 'var(--container-border-style, solid)',
          borderColor: 'var(--container-border-color, transparent)',
          borderRadius: 'var(--container-border-radius, 0px)',
          padding: 'var(--container-padding, 16px)',
        }}
      >
        <div className="flex flex-col h-full justify-between">
          {/* Shelf rows */}
          {[1, 2].map((index) => (
            <div key={`preview-shelf-${index}`} className="relative">
              {/* Dividers if enabled */}
              {index === 1 && (
                <div className="absolute inset-x-0 -top-[calc(var(--divider-thickness,_6px))] flex justify-around pointer-events-none" 
                     style={{ display: 'var(--dividers-visible, none)' }}>
                  {[1, 2].map((divIndex) => (
                    <div 
                      key={`preview-divider-${divIndex}`}
                      className="h-[calc(var(--shelf-thickness,_20px)_+_40px)]"
                      style={{
                        width: 'var(--divider-thickness, 6px)',
                        backgroundColor: 'var(--divider-color, #714621)',
                        backgroundImage: 'var(--divider-bg-image, none)',
                        opacity: 'var(--divider-opacity, 0.8)',
                      }}
                    />
                  ))}
                </div>
              )}
              
              {/* Shelf */}
              <div 
                className="w-full"
                style={{
                  height: 'var(--shelf-thickness, 20px)',
                  backgroundColor: 'var(--shelf-color, #d2b48c)',
                  backgroundImage: 'var(--shelf-texture, none)',
                  backgroundSize: 'cover',
                  opacity: 'var(--shelf-opacity, 1)',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                  marginTop: index === 1 ? '60px' : '0'
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookshelfPreview;
