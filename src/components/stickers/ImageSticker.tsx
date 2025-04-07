
import React from 'react';

interface ImageStickerProps {
  url: string;
  style?: React.CSSProperties;
}

const ImageSticker: React.FC<ImageStickerProps> = ({ url, style }) => {
  return (
    <div 
      style={{
        backgroundImage: `url(${url})`,
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        width: '100%',
        height: '100%',
        ...style
      }}
    />
  );
};

export default ImageSticker;
