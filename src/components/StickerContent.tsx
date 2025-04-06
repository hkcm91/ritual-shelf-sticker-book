
import React, { forwardRef, useRef, useEffect, useState } from 'react';
import Lottie from 'lottie-react';
import { useBookshelfStore } from '../store/bookshelfStore';

type StickerContentProps = {
  book: any;
  scale: number;
  position2D: { x: number, y: number };
  rotation: number;
  handleStickerMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
  isAltDrag?: boolean;
};

// Using forwardRef to properly handle refs from PopoverTrigger
const StickerContent = forwardRef<HTMLDivElement, StickerContentProps>(({
  book,
  scale,
  position2D,
  rotation,
  handleStickerMouseDown,
  isAltDrag = false
}, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 150, height: 220 });
  const { updateBook } = useBookshelfStore();
  const [altKeyPressed, setAltKeyPressed] = useState(false);
  const [lottieError, setLottieError] = useState(false);

  // Measure container on mount and resize
  useEffect(() => {
    if (containerRef.current) {
      const updateSize = () => {
        const { width, height } = containerRef.current?.getBoundingClientRect() || { width: 150, height: 220 };
        setContainerSize({ width, height });
      };
      
      updateSize();
      window.addEventListener('resize', updateSize);
      return () => window.removeEventListener('resize', updateSize);
    }
  }, []);

  // Listen for Alt key press/release
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Alt') {
        setAltKeyPressed(true);
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Alt') {
        setAltKeyPressed(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  if (!book || !book.isSticker) return null;
  
  try {
    // Common style for all stickers
    const stickerStyle = {
      transform: `scale(${scale}) translate(${position2D.x / scale}px, ${position2D.y / scale}px) rotate(${rotation}deg)`,
      transformOrigin: 'center',
      width: '100%',
      height: '100%',
      // Add a subtle border when alt key is pressed for extended movement
      boxShadow: altKeyPressed ? '0 0 0 2px rgba(255, 165, 0, 0.5)' : 'none',
      transition: 'box-shadow 0.2s ease'
    };
    
    // Check if it's a Lottie JSON
    let isLottie = false;
    let animationData = null;
    
    if (typeof book.coverURL === 'string') {
      // Try to parse as JSON first to check if it's a Lottie animation
      try {
        if (book.coverURL.startsWith('{') || book.coverURL.trim().startsWith('{')) {
          animationData = JSON.parse(book.coverURL);
          isLottie = Boolean(animationData && (animationData.v !== undefined || animationData.animations));
        }
      } catch (e) {
        console.log("Not a valid JSON:", e);
        isLottie = false;
      }
    }
    
    return (
      <div 
        ref={(node) => {
          // Handle both refs
          if (typeof ref === 'function') {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
          containerRef.current = node;
        }}
        className="w-full h-full cursor-move relative"
        onMouseDown={handleStickerMouseDown}
        style={isLottie ? stickerStyle : {
          backgroundImage: `url(${book.coverURL})`,
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          ...stickerStyle
        }}
      >
        {isLottie && animationData && !lottieError && (
          <div className="w-full h-full flex items-center justify-center">
            <Lottie 
              animationData={animationData} 
              loop={true} 
              autoplay={true}
              style={{ 
                width: '100%', 
                height: '100%',
                pointerEvents: 'none' // Make Lottie ignore pointer events
              }}
              onError={() => setLottieError(true)}
            />
          </div>
        )}
        
        {isLottie && lottieError && (
          <div className="w-full h-full flex items-center justify-center text-red-500 text-xs">
            Lottie error
          </div>
        )}
        
        {/* Small helper tip that appears when holding Alt */}
        {altKeyPressed && (
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-orange-500 text-white text-xs px-2 py-0.5 rounded whitespace-nowrap opacity-80">
            Extended boundaries
          </div>
        )}
      </div>
    );
  } catch (e) {
    // Fallback if there's an error
    console.error("Error rendering sticker:", e);
    return (
      <div ref={ref} className="flex items-center justify-center w-full h-full text-red-500">
        Invalid sticker
      </div>
    );
  }
});

StickerContent.displayName = 'StickerContent';

export default StickerContent;
