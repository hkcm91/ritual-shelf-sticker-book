
import React from 'react';

interface BookshelfBackPanelProps {
  color: string;
  textureUrl: string;
}

const BookshelfBackPanel: React.FC<BookshelfBackPanelProps> = ({
  color,
  textureUrl
}) => {
  return (
    <div 
      className="bookshelf-back-panel" 
      style={{
        backgroundColor: color,
        backgroundImage: `url(${textureUrl})`,
        backgroundSize: '100% 100%',
        opacity: 0.8,
        filter: 'brightness(0.6)',
        zIndex: 1
      }} 
    />
  );
};

export default BookshelfBackPanel;
