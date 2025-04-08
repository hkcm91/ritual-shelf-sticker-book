
import { useCallback } from 'react';

export interface UseLottieFileHandlerProps {
  onSuccess?: (jsonContent: string) => void;
  onError?: (error: Error) => void;
}

export const useLottieFileHandler = ({
  onSuccess,
  onError
}: UseLottieFileHandlerProps = {}) => {
  
  const processLottieFile = useCallback((file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          if (typeof event.target?.result === 'string') {
            const jsonContent = event.target.result;
            
            // Validate the Lottie JSON format
            try {
              const lottieData = JSON.parse(jsonContent);
              
              // Check for Lottie specific properties
              if (lottieData && (lottieData.v !== undefined || lottieData.animations)) {
                if (onSuccess) onSuccess(jsonContent);
                resolve(jsonContent);
              } else {
                const error = new Error('Invalid Lottie animation format');
                if (onError) onError(error);
                reject(error);
              }
            } catch (e) {
              const error = new Error('Failed to parse JSON file');
              if (onError) onError(error);
              reject(error);
            }
          } else {
            const error = new Error('Failed to read file');
            if (onError) onError(error);
            reject(error);
          }
        } catch (err) {
          if (onError && err instanceof Error) onError(err);
          reject(err);
        }
      };
      
      reader.onerror = () => {
        const error = new Error('Error reading file');
        if (onError) onError(error);
        reject(error);
      };
      
      reader.readAsText(file);
    });
  }, [onSuccess, onError]);
  
  return {
    processLottieFile
  };
};

export default useLottieFileHandler;
