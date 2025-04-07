
import { useState, useEffect, useRef } from 'react';

type UseStickerContentProps = {
  coverURL?: string;
};

export const useStickerContent = ({ coverURL }: UseStickerContentProps) => {
  const [containerSize, setContainerSize] = useState({ width: 150, height: 220 });
  const [altKeyPressed, setAltKeyPressed] = useState(false);
  const [lottieError, setLottieError] = useState(false);
  const [isLottie, setIsLottie] = useState(false);
  const [animationData, setAnimationData] = useState<any>(null);
  const [imageError, setImageError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Measure container on mount and resize
  useEffect(() => {
    if (containerRef.current) {
      const updateSize = () => {
        const { width, height } = containerRef.current?.getBoundingClientRect() || { width: 150, height: 220 };
        setContainerSize({ width, height });
      };
      
      updateSize();
      window.addEventListener('resize', updateSize);
      return () => window.removeEventListener('resize', updateSize);
    }
  }, []);

  // Listen for Alt key press/release
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Alt') {
        setAltKeyPressed(true);
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Alt') {
        setAltKeyPressed(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Check if content is Lottie
  useEffect(() => {
    if (!coverURL) return;
    
    let isLottieAnimation = false;
    let lottieParsed = null;
    setImageError(false);
    
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

  return {
    containerRef,
    containerSize,
    altKeyPressed,
    lottieError,
    isLottie,
    animationData,
    imageError,
    setImageError,
    setLottieError
  };
};
