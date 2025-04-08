
import React from 'react';

export interface ShelfWoodProps {
  thickness: number;
  color: string;
  opacity: number;
  textureUrl: string;
  useRealisticStyle: boolean;
  className?: string;
  zIndex?: number;
}

const ShelfWood: React.FC<ShelfWoodProps> = ({
  thickness,
  color,
  opacity,
  textureUrl,
  useRealisticStyle,
  className = '',
  zIndex = 5
}) => {
  const boxShadow = useRealisticStyle 
    ? '0 6px 10px rgba(0,0,0,0.4)' 
    : '0px 4px 6px -2px rgba(0,0,0,0.3)';
    
  return (
    <div 
      className={`wood-shelf ${className}`} 
      style={{
        height: `${thickness}px`,
        backgroundImage: `url(${textureUrl})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundColor: color,
        opacity,
        boxShadow,
        zIndex,
        position: 'relative',
        width: '100%'
      }} 
    />
  );
};

export default ShelfWood;
