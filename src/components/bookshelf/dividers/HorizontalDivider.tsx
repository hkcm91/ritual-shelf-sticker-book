
import React from 'react';

export interface HorizontalDividerProps {
  thickness: number;
  color: string;
  opacity: number;
  textureUrl: string;
  className?: string;
  width?: string | number;
  zIndex?: number;
}

const HorizontalDivider: React.FC<HorizontalDividerProps> = ({
  thickness,
  color,
  opacity,
  textureUrl,
  className = '',
  width = '100%',
  zIndex = 5
}) => {
  return (
    <div 
      className={`horizontal-shelf-divider ${className}`} 
      style={{
        height: `${thickness}px`,
        backgroundColor: color,
        backgroundImage: `url(${textureUrl})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        opacity,
        width: typeof width === 'number' ? `${width}px` : width,
        position: 'relative',
        zIndex
      }} 
    />
  );
};

export default HorizontalDivider;
