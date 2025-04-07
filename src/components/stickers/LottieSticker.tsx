
import React from 'react';
import Lottie from 'lottie-react';
import { toast } from 'sonner';

interface LottieStickerProps {
  animationData: any;
  width?: string | number;
  height?: string | number;
}

const LottieSticker: React.FC<LottieStickerProps> = ({
  animationData,
  width = '100%',
  height = '100%'
}) => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <Lottie 
        animationData={animationData} 
        loop={true} 
        autoplay={true}
        style={{ 
          width, 
          height,
          pointerEvents: 'none' // Make Lottie ignore pointer events
        }}
        onError={() => {
          toast.error("Failed to load Lottie animation");
        }}
      />
    </div>
  );
};

export default LottieSticker;
