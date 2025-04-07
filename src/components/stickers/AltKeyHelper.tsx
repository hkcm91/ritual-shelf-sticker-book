
import React from 'react';

interface AltKeyHelperProps {
  isVisible: boolean;
}

const AltKeyHelper: React.FC<AltKeyHelperProps> = ({ isVisible }) => {
  if (!isVisible) return null;
  
  return (
    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-orange-500 text-white text-xs px-2 py-0.5 rounded whitespace-nowrap opacity-80">
      Extended boundaries
    </div>
  );
};

export default AltKeyHelper;
