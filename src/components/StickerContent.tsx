
import React from 'react';
import Lottie from 'lottie-react';

type StickerContentProps = {
  book: any;
  scale: number;
  position2D: { x: number, y: number };
  rotation: number;
  handleStickerMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
};

const StickerContent: React.FC<StickerContentProps> = ({
  book,
  scale,
  position2D,
  rotation,
  handleStickerMouseDown
}) => {
  if (!book) return null;
  
  try {
    // Common style for all stickers
    const stickerStyle = {
      transform: `scale(${scale}) translate(${position2D.x / scale}px, ${position2D.y / scale}px) rotate(${rotation}deg)`,
      transformOrigin: 'center',
      width: '100%',
      height: '100%'
    };
    
    // Check if it's a Lottie JSON
    let isLottie = false;
    let animationData = null;
    
    if (typeof book.coverURL === 'string' && book.coverURL.startsWith('{')) {
      try {
        animationData = JSON.parse(book.coverURL);
        isLottie = true;
      } catch (e) {
        isLottie = false;
      }
    }
    
    return (
      <div 
        className="w-full h-full cursor-move"
        onClick={(e) => e.stopPropagation()}
        onMouseDown={handleStickerMouseDown}
        style={isLottie ? stickerStyle : {
          backgroundImage: `url(${book.coverURL})`,
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          ...stickerStyle
        }}
      >
        {isLottie && animationData && (
          <div className="w-full h-full flex items-center justify-center">
            <Lottie 
              animationData={animationData} 
              loop={true} 
              autoplay={true}
              style={{ width: '100%', height: '100%' }}
            />
          </div>
        )}
      </div>
    );
  } catch (e) {
    // Fallback if there's an error
    console.error("Error rendering sticker:", e);
    return (
      <div className="flex items-center justify-center w-full h-full text-red-500">
        Invalid sticker
      </div>
    );
  }
};

export default StickerContent;
