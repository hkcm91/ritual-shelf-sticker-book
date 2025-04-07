
import React from 'react';
import BookPlaceholders from './BookPlaceholders';
import ShelfBlock from './ShelfBlock';

interface ShelfRowProps {
  position: 'top' | 'bottom';
}

const ShelfRow: React.FC<ShelfRowProps> = ({ position }) => {
  const delay = position === 'top' ? 0 : 0.2;
  
  return (
    <div className="mb-4 relative">
      <BookPlaceholders position={position} delay={delay} />
      <ShelfBlock delay={delay} />
    </div>
  );
};

export default ShelfRow;
