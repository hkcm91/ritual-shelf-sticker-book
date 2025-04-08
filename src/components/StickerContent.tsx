
import React, { forwardRef, useRef, useEffect, useState } from 'react';
import { useAnimationDetection } from './stickers/useAnimationDetection';
import LottieSticker from './stickers/LottieSticker';
import ImageSticker from './stickers/ImageSticker';
import StickerErrorState from './stickers/StickerErrorState';
import AltKeyHelper from './stickers/AltKeyHelper';

export interface StickerContentProps {
  book: any;
  scale: number;
  position2D: { x: number, y: number };
  rotation: number;
  zIndex?: number;
  handleStickerMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
  isAltDrag?: boolean;
  className?: string;
}

// Using forwardRef to properly handle refs from PopoverTrigger
const StickerContent = forwardRef<HTMLDivElement, StickerContentProps>(({
  book,
  scale,
  position2D,
  rotation,
  zIndex = 1,
  handleStickerMouseDown,
  isAltDrag = false,
  className = ''
}, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 150, height: 220 });
  const [altKeyPressed, setAltKeyPressed] = useState(false);
  
  // Use the custom hook for animation detection
  const { isLottie, lottieError, animationData } = useAnimationDetection(book?.coverURL);

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
      transition: 'box-shadow 0.2s ease',
      zIndex: book.zIndex || zIndex
    };
    
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
        className={`w-full h-full cursor-move relative ${className}`}
        onMouseDown={handleStickerMouseDown}
        style={stickerStyle}
      >
        {isLottie ? (
          <>
            {animationData && !lottieError ? (
              <LottieSticker animationData={animationData} />
            ) : (
              <StickerErrorState />
            )}
          </>
        ) : (
          <ImageSticker url={book.coverURL as string} />
        )}
        
        {/* Alt key helper component */}
        <AltKeyHelper isVisible={altKeyPressed} />
      </div>
    );
  } catch (e) {
    // Fallback if there's an error
    console.error("Error rendering sticker:", e);
    return (
      <div ref={ref} className="flex items-center justify-center w-full h-full text-red-500">
        <StickerErrorState message="Invalid sticker" />
      </div>
    );
  }
});

StickerContent.displayName = 'StickerContent';

export default StickerContent;
