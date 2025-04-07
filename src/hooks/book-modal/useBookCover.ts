
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export const useBookCover = (initialCoverURL: string = '') => {
  const [coverURL, setCoverURL] = useState<string>(initialCoverURL);
  
  // Update cover URL when initialCoverURL changes
  useEffect(() => {
    setCoverURL(initialCoverURL);
    console.log('Cover URL updated from prop:', 
      initialCoverURL ? `present (${initialCoverURL.length} chars)` : 'missing');
  }, [initialCoverURL]);
  
  const handleCoverChange = (imageUrl: string) => {
    console.log('Cover changed, new length:', imageUrl ? imageUrl.length : 0);
    console.log('Cover sample:', imageUrl ? imageUrl.substring(0, 50) + '...' : 'undefined');
    
    // Validate image URL
    if (imageUrl && typeof imageUrl === 'string') {
      // Make sure it's a proper image data URL
      if (imageUrl.startsWith('data:image/')) {
        setCoverURL(imageUrl);
        return;
      }
    }
    
    // If we got here, there's a problem with the image URL
    console.warn('Invalid image URL provided:', typeof imageUrl);
    toast.error('Invalid image format');
  };
  
  return {
    coverURL,
    setCoverURL,
    handleCoverChange
  };
};
