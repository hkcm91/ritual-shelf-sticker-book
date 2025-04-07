
import React from 'react';
import { BookData } from '@/store/types';

interface StickerProps {
  data: BookData;
}

const Sticker: React.FC<StickerProps> = ({ data }) => {
  const { 
    coverURL, 
    position2D = { x: 0, y: 0 },
    scale = 1,
    rotation = 0
  } = data;
  
  const stickerStyle = {
    position: 'absolute' as const,
    left: `${position2D.x}px`,
    top: `${position2D.y}px`,
    transform: `scale(${scale}) rotate(${rotation}deg)`,
    transformOrigin: 'center',
    width: '100px',
    height: '100px',
    pointerEvents: 'auto' as const,
  };
  
  return (
    <div 
      className="sticker" 
      style={stickerStyle}
    >
      <img 
        src={coverURL as string} 
        alt="Sticker"
        className="w-full h-full object-contain select-none"
        draggable={false}
      />
    </div>
  );
};

export default Sticker;
