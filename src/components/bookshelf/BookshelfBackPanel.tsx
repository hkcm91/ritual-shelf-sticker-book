
import React from 'react';

export interface BookshelfBackPanelProps {
  color: string;
  textureUrl: string;
  opacity?: number;
  brightness?: number;
  zIndex?: number;
  className?: string;
}

const BookshelfBackPanel: React.FC<BookshelfBackPanelProps> = ({
  color,
  textureUrl,
  opacity = 0.8,
  brightness = 0.6,
  zIndex = 1,
  className = ''
}) => {
  return (
    <div 
      className={`bookshelf-back-panel ${className}`} 
      style={{
        backgroundColor: color,
        backgroundImage: `url(${textureUrl})`,
        backgroundSize: '100% 100%',
        opacity,
        filter: `brightness(${brightness})`,
        zIndex,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      }} 
    />
  );
};

export default BookshelfBackPanel;
