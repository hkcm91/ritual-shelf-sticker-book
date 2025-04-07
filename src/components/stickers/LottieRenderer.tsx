
import React, { useState } from 'react';
import Lottie from 'lottie-react';
import { toast } from 'sonner';

type LottieRendererProps = {
  animationData: any;
  className?: string;
};

const LottieRenderer: React.FC<LottieRendererProps> = ({ 
  animationData,
  className = "w-full h-full"
}) => {
  const [lottieError, setLottieError] = useState(false);
  
  if (lottieError) {
    return (
      <div className="w-full h-full flex items-center justify-center text-red-500 text-xs">
        Lottie error
      </div>
    );
  }
  
  return (
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
        className={className}
        onError={() => {
          setLottieError(true);
          toast.error("Failed to load Lottie animation");
        }}
      />
    </div>
  );
};

export default LottieRenderer;
