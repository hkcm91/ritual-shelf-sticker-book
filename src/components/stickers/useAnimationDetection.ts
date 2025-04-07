
import { useState, useEffect } from 'react';

export const useAnimationDetection = (coverURL: string | undefined) => {
  const [isLottie, setIsLottie] = useState(false);
  const [lottieError, setLottieError] = useState(false);
  const [animationData, setAnimationData] = useState<any>(null);
  
  useEffect(() => {
    if (!coverURL) {
      setIsLottie(false);
      return;
    }
    
    let isLottieAnimation = false;
    let lottieParsed = null;
    
    // Try to determine if this is a Lottie animation
    try {
      // If it's a URL that ends with .json
      if (typeof coverURL === 'string') {
        if (coverURL.startsWith('http') && coverURL.endsWith('.json')) {
          // Fetch the JSON from URL
          fetch(coverURL)
            .then(response => response.json())
            .then(data => {
              if (data && (data.v !== undefined || data.animations)) {
                setIsLottie(true);
                setAnimationData(data);
              } else {
                setIsLottie(false);
                setLottieError(true);
              }
            })
            .catch(err => {
              console.error("Failed to fetch Lottie JSON:", err);
              setLottieError(true);
            });
          return;
        }
        
        // If it's an inline JSON string
        if (coverURL.startsWith('{') || coverURL.trim().startsWith('{')) {
          try {
            lottieParsed = JSON.parse(coverURL);
            isLottieAnimation = Boolean(lottieParsed && (lottieParsed.v !== undefined || lottieParsed.animations));
            if (isLottieAnimation) {
              setIsLottie(true);
              setAnimationData(lottieParsed);
              return;
            }
          } catch (e) {
            console.log("Not a valid JSON:", e);
          }
        }
      }
      
      // Not a Lottie animation
      setIsLottie(false);
    } catch (e) {
      console.error("Error checking for Lottie:", e);
      setIsLottie(false);
      setLottieError(true);
    }
  }, [coverURL]);

  return { isLottie, lottieError, animationData };
};
