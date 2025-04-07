
import React, { forwardRef } from 'react';
import { useStickerContent } from '../hooks/useStickerContent';
import LottieRenderer from './stickers/LottieRenderer';
import ImageRenderer from './stickers/ImageRenderer';
import AltKeyHelper from './stickers/AltKeyHelper';

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
  const {
    containerRef,
    altKeyPressed,
    isLottie,
    animationData,
    lottieError,
    imageError
  } = useStickerContent({ coverURL: book?.coverURL });

  if (!book || !book.isSticker) return null;
  
  // Verify that the coverURL is valid
  const hasCover = book.coverURL && book.coverURL !== '';
  
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
          backgroundImage: hasCover ? `url(${book.coverURL})` : 'none',
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          ...stickerStyle
        }}
      >
        {/* Image renderer for non-Lottie content */}
        {!isLottie && <ImageRenderer coverURL={book.coverURL} />}
        
        {/* Lottie renderer for Lottie content */}
        {isLottie && animationData && !lottieError && (
          <LottieRenderer animationData={animationData} />
        )}
        
        {/* Error state for Lottie */}
        {isLottie && lottieError && (
          <div className="w-full h-full flex items-center justify-center text-red-500 text-xs">
            Lottie error
          </div>
        )}
        
        {/* Alt key helper */}
        <AltKeyHelper visible={altKeyPressed} />
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
