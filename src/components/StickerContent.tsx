import React, { forwardRef, useRef, useEffect, useState } from 'react';
import Lottie from 'lottie-react';
import { useBookshelfStore } from '../store/bookshelfStore';

type StickerContentProps = {
  book: any;
  scale: number;
  position2D: { x: number, y: number };
  rotation: number;
  handleStickerMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
};

// Using forwardRef to properly handle refs from PopoverTrigger
const StickerContent = forwardRef<HTMLDivElement, StickerContentProps>(({
  book,
  scale,
  position2D,
  rotation,
  handleStickerMouseDown
}, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 150, height: 220 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [currentPosition, setCurrentPosition] = useState(position2D);
  const { updateBook } = useBookshelfStore();

  // Update internal position when prop changes
  useEffect(() => {
    setCurrentPosition(position2D);
  }, [position2D]);

  // Measure container on mount
  useEffect(() => {
    if (containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect();
      setContainerSize({ width, height });
    }
  }, []);

  // Handle mouse down for dragging
  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    
    // Skip if it's not a sticker
    if (!book?.isSticker) return;
    
    setIsDragging(true);
    setDragStart({
      x: e.clientX,
      y: e.clientY
    });
    
    // Call the original handler as well
    handleStickerMouseDown(e);
  };

  // Handle mouse move while dragging
  const onMouseMove = (e: MouseEvent) => {
    if (!isDragging || !book?.isSticker) return;
    
    // Calculate the bounds for dragging
    // We need to consider the sticker size to keep it within bounds
    const stickerWidth = containerRef.current?.offsetWidth || 150;
    const stickerHeight = containerRef.current?.offsetHeight || 220;
    
    const maxBoundaryX = containerSize.width / 2 - (stickerWidth * scale / 2);
    const maxBoundaryY = containerSize.height / 2 - (stickerHeight * scale / 2);
    
    // Calculate new position with clamping to keep within boundaries
    const newX = Math.max(-maxBoundaryX, Math.min(maxBoundaryX, 
      currentPosition.x + (e.clientX - dragStart.x) / scale));
    const newY = Math.max(-maxBoundaryY, Math.min(maxBoundaryY, 
      currentPosition.y + (e.clientY - dragStart.y) / scale));
    
    // Update position
    setCurrentPosition({ x: newX, y: newY });
    
    // Update drag start position for next move calculation
    setDragStart({
      x: e.clientX,
      y: e.clientY
    });
  };

  // Handle mouse up to end dragging
  const onMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      
      // Update the book position in the store if position has changed
      if (book && (currentPosition.x !== position2D.x || currentPosition.y !== position2D.y)) {
        // Here we could call an update function to persist the change
        if (updateBook && book.id) {
          // We're not directly updating the book object, but indicating the position changed
          // The actual position is stored in localStorage via useTransformControls
        }
      }
    }
  };

  // Set up and clean up event listeners
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
      
      return () => {
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
      };
    }
  }, [isDragging, dragStart, currentPosition]);

  if (!book || !book.isSticker) return null;
  
  try {
    // Common style for all stickers
    const stickerStyle = {
      transform: `scale(${scale}) translate(${currentPosition.x / scale}px, ${currentPosition.y / scale}px) rotate(${rotation}deg)`,
      transformOrigin: 'center',
      width: '100%',
      height: '100%'
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
        className="w-full h-full cursor-move"
        onMouseDown={onMouseDown}
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
              style={{ 
                width: '100%', 
                height: '100%',
                pointerEvents: 'none' // Make Lottie ignore pointer events
              }}
            />
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
