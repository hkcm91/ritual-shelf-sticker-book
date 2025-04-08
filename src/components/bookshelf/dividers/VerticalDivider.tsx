
import React from 'react';

type VerticalDividerProps = {
  thickness: number;
  height: number;
  color: string;
  opacity: number;
  textureUrl: string;
  className?: string;
  isSide?: boolean;
  side?: 'left' | 'right';
};

const VerticalDivider: React.FC<VerticalDividerProps> = ({
  thickness,
  height,
  color,
  opacity,
  textureUrl,
  className = '',
  isSide = false,
  side
}) => {
  const sideClass = isSide ? `shelf-side-${side}` : '';
  
  return (
    <div 
      className={`vertical-shelf-divider ${sideClass} ${className}`} 
      style={{
        width: `${thickness}px`,
        height: `${height}px`,
        backgroundColor: color,
        backgroundImage: `url(${textureUrl})`,
        opacity,
        flexShrink: 0,
        alignSelf: 'stretch'
      }} 
    />
  );
};

export default VerticalDivider;
