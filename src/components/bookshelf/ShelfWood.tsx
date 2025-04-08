
import React from 'react';

interface ShelfWoodProps {
  thickness: number;
  color: string;
  opacity: number;
  textureUrl: string;
  useRealisticStyle: boolean;
}

const ShelfWood: React.FC<ShelfWoodProps> = ({
  thickness,
  color,
  opacity,
  textureUrl,
  useRealisticStyle
}) => {
  return (
    <div 
      className="wood-shelf" 
      style={{
        height: `${thickness}px`,
        backgroundImage: `url(${textureUrl})`,
        backgroundColor: color,
        opacity,
        boxShadow: useRealisticStyle ? '0 6px 10px rgba(0,0,0,0.4)' : '0px 4px 6px -2px rgba(0,0,0,0.3)',
        zIndex: 5
      }} 
    />
  );
};

export default ShelfWood;
