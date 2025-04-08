
import { useState, useEffect } from 'react';

export const useAnimationDetection = (coverURL: string | undefined) => {
  const [isLottie, setIsLottie] = useState(false);
  const [lottieError, setLottieError] = useState(false);
  const [animationData, setAnimationData] = useState<any>(null);
  
  useEffect(() => {
    if (!coverURL) {
      setIsLottie(false);
      setAnimationData(null);
      return;
    }
    
    // Check if it looks like a JSON string (for Lottie)
    const isJsonString = typeof coverURL === 'string' && 
      (coverURL.startsWith('{') || coverURL.startsWith('['));
    
    if (isJsonString) {
      try {
        const parsedData = JSON.parse(coverURL);
        
        // Check for common Lottie properties
        if (parsedData && (parsedData.v !== undefined || 
                          parsedData.animations || 
                          parsedData.layers)) {
          setIsLottie(true);
          setAnimationData(parsedData);
          setLottieError(false);
        } else {
          setIsLottie(true);
          setLottieError(true);
        }
      } catch (e) {
        console.error("Error parsing Lottie JSON:", e);
        setIsLottie(true);
        setLottieError(true);
      }
    } else {
      setIsLottie(false);
      setAnimationData(null);
    }
  }, [coverURL]);
  
  return { isLottie, lottieError, animationData };
};

export default useAnimationDetection;
