
import React from 'react';

type HorizontalDividerProps = {
  thickness: number;
  color: string;
  opacity: number;
  textureUrl: string;
  className?: string;
};

const HorizontalDivider: React.FC<HorizontalDividerProps> = ({
  thickness,
  color,
  opacity,
  textureUrl,
  className = ''
}) => {
  return (
    <div 
      className={`horizontal-shelf-divider ${className}`} 
      style={{
        height: `${thickness}px`,
        backgroundColor: color,
        backgroundImage: `url(${textureUrl})`,
        opacity,
        width: '100%',
        position: 'relative',
        zIndex: 5
      }} 
    />
  );
};

export default HorizontalDivider;
