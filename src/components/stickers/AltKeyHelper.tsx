
import React from 'react';

interface AltKeyHelperProps {
  isVisible: boolean;
}

const AltKeyHelper: React.FC<AltKeyHelperProps> = ({ isVisible }) => {
  if (!isVisible) return null;
  
  return (
    <div className="absolute bottom-0 right-0 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded-tl-md">
      Alt + Drag
    </div>
  );
};

export default AltKeyHelper;
