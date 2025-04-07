
import React from 'react';

const BookshelfPreview: React.FC = () => {
  return (
    <div className="relative w-full rounded overflow-hidden border shadow-sm" style={{ height: '240px' }}>
      {/* Container with customizable properties */}
      <div 
        className="preview-container h-full w-full relative"
        style={{
          backgroundColor: 'var(--container-bg, #2e4600)',
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
        {/* Side dividers if enabled */}
        <div 
          className="absolute left-0 top-0 bottom-0 pointer-events-none" 
          style={{ 
            display: 'var(--dividers-visible, none)',
            width: 'var(--divider-thickness, 6px)',
            backgroundColor: 'var(--divider-color, #714621)',
            backgroundImage: 'var(--divider-bg-image, none)',
            opacity: 'var(--divider-opacity, 0.8)',
          }}
        />
        <div 
          className="absolute right-0 top-0 bottom-0 pointer-events-none" 
          style={{ 
            display: 'var(--dividers-visible, none)',
            width: 'var(--divider-thickness, 6px)',
            backgroundColor: 'var(--divider-color, #714621)',
            backgroundImage: 'var(--divider-bg-image, none)',
            opacity: 'var(--divider-opacity, 0.8)',
          }}
        />
        
        <div className="flex flex-col h-full justify-between">
          {/* First Shelf Row */}
          <div className="mb-4 relative">
            {/* Book placeholders */}
            <div className="flex justify-around mb-1">
              {[1, 2, 3].map((slotIndex) => (
                <div 
                  key={`preview-slot-top-${slotIndex}`}
                  className="w-[24px] h-[60px] bg-gray-300/30 rounded-sm mx-2"
                  style={{
                    backgroundColor: slotIndex === 2 ? 'var(--divider-color, #714621)' : '#adadad30',
                    width: slotIndex === 2 ? 'var(--divider-thickness, 6px)' : '24px',
                    display: slotIndex === 2 ? 'var(--dividers-visible, block)' : 'block',
                    opacity: slotIndex === 2 ? 'var(--divider-opacity, 0.8)' : '0.3',
                  }}
                />
              ))}
            </div>
            
            {/* Shelf */}
            <div 
              className="w-full"
              style={{
                height: 'var(--shelf-thickness, 20px)',
                backgroundColor: 'var(--shelf-color, #2e4600)',
                backgroundImage: 'var(--shelf-texture, none)',
                backgroundSize: 'cover',
                opacity: 'var(--shelf-opacity, 1)',
                boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
              }}
            />
          </div>
          
          {/* Second Shelf Row */}
          <div className="relative mb-4">
            {/* Book placeholders */}
            <div className="flex justify-around mb-1">
              {[1, 2, 3].map((slotIndex) => (
                <div 
                  key={`preview-slot-bottom-${slotIndex}`}
                  className="w-[24px] h-[60px] bg-gray-300/30 rounded-sm mx-2"
                  style={{
                    backgroundColor: slotIndex === 2 ? 'var(--divider-color, #714621)' : '#adadad30',
                    width: slotIndex === 2 ? 'var(--divider-thickness, 6px)' : '24px',
                    display: slotIndex === 2 ? 'var(--dividers-visible, block)' : 'block',
                    opacity: slotIndex === 2 ? 'var(--divider-opacity, 0.8)' : '0.3',
                  }}
                />
              ))}
            </div>
            
            {/* Shelf */}
            <div 
              className="w-full"
              style={{
                height: 'var(--shelf-thickness, 20px)',
                backgroundColor: 'var(--shelf-color, #2e4600)',
                backgroundImage: 'var(--shelf-texture, none)',
                backgroundSize: 'cover',
                opacity: 'var(--shelf-opacity, 1)',
                boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookshelfPreview;
