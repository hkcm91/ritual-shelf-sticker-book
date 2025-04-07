
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export const useBookCover = (initialCoverURL: string = '') => {
  const [coverURL, setCoverURL] = useState<string>(initialCoverURL);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  
  // Update cover URL when initialCoverURL changes
  useEffect(() => {
    if (initialCoverURL !== coverURL) {
      setCoverURL(initialCoverURL);
      console.log('Cover URL updated from prop:', 
        initialCoverURL ? `present (${initialCoverURL.length} chars)` : 'missing');
    }
  }, [initialCoverURL]);
  
  const simulateProgress = () => {
    setIsUploading(true);
    setUploadProgress(0);
    
    // Simulate progress updates
    const interval = window.setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          window.clearInterval(interval);
          return 90; // Hold at 90% until complete
        }
        return prev + Math.floor(Math.random() * 15);
      });
    }, 100);
    
    return interval; // Return the interval ID for clearing later
  };
  
  const completeProgress = (intervalId?: number) => {
    if (intervalId) {
      window.clearInterval(intervalId);
    }
    
    setUploadProgress(100);
    // Add a small delay before removing the progress indicator
    window.setTimeout(() => {
      setIsUploading(false);
      setUploadProgress(0);
    }, 500);
  };
  
  const handleCoverChange = async (imageUrl: string) => {
    // If no image is provided
    if (!imageUrl) {
      setCoverURL('');
      return;
    }
    
    console.log('Cover changed, new length:', imageUrl ? imageUrl.length : 0);
    console.log('Cover sample:', imageUrl ? imageUrl.substring(0, 50) + '...' : 'undefined');
    
    // Start the progress simulation
    const progressInterval = simulateProgress();
    
    try {
      // Validate image URL
      if (imageUrl && typeof imageUrl === 'string') {
        // Make sure it's a proper image data URL
        if (imageUrl.startsWith('data:image/')) {
          // We're good to update the state
          setCoverURL(imageUrl);
          completeProgress(progressInterval);
          return;
        }
        
        // External URL validation - check if it's a URL to an image
        if (imageUrl.startsWith('http')) {
          // Just accept it for now (we could add validation)
          setCoverURL(imageUrl);
          completeProgress(progressInterval);
          return;
        }
      }
      
      // If we got here, there's a problem with the image URL
      window.clearInterval(progressInterval);
      setIsUploading(false);
      console.warn('Invalid image URL provided:', typeof imageUrl);
      toast.error('Invalid image format');
      
    } catch (error) {
      // Clear progress and show error
      window.clearInterval(progressInterval);
      setIsUploading(false);
      console.error('Error processing image:', error);
      toast.error('Failed to process image');
    }
  };
  
  return {
    coverURL,
    setCoverURL,
    handleCoverChange,
    isUploading,
    uploadProgress
  };
};
