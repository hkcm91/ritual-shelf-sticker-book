
import React from 'react';

interface StickerErrorStateProps {
  message?: string;
}

const StickerErrorState: React.FC<StickerErrorStateProps> = ({ 
  message = "Lottie error" 
}) => {
  return (
    <div className="w-full h-full flex items-center justify-center text-red-500 text-xs">
      {message}
    </div>
  );
};

export default StickerErrorState;
