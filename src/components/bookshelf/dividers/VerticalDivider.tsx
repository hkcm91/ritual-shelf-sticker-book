
import React from 'react';

export interface VerticalDividerProps {
  thickness: number;
  height: number | string;
  color: string;
  opacity: number;
  textureUrl: string;
  className?: string;
  isSide?: boolean;
  side?: 'left' | 'right';
  zIndex?: number;
}

const VerticalDivider: React.FC<VerticalDividerProps> = ({
  thickness,
  height,
  color,
  opacity,
  textureUrl,
  className = '',
  isSide = false,
  side,
  zIndex = 5
}) => {
  const sideClass = isSide ? `shelf-side-${side}` : '';
  
  return (
    <div 
      className={`vertical-shelf-divider ${sideClass} ${className}`} 
      style={{
        width: `${thickness}px`,
        height: typeof height === 'number' ? `${height}px` : height,
        backgroundColor: color,
        backgroundImage: `url(${textureUrl})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        opacity,
        flexShrink: 0,
        alignSelf: 'stretch',
        position: 'relative',
        zIndex
      }} 
    />
  );
};

export default VerticalDivider;
