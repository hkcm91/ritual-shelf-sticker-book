
import React, { useState } from 'react';

type ImageRendererProps = {
  coverURL: string;
};

const ImageRenderer: React.FC<ImageRendererProps> = ({ coverURL }) => {
  const [imageError, setImageError] = useState(false);
  
  // If image fails to load
  if (imageError) {
    return (
      <div className="text-red-400 text-xs text-center">Image error</div>
    );
  }
  
  // If no coverURL is provided
  if (!coverURL || coverURL === '') {
    return (
      <div className="text-gray-400 text-xs text-center">No image</div>
    );
  }
  
  return null; // Return null as the parent component handles background image
};

export default ImageRenderer;
