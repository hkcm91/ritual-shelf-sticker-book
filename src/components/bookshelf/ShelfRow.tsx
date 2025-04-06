
import React from 'react';
import BookSlot from '../BookSlot';

type ShelfRowProps = {
  rowIndex: number;
  columns: number;
  shelfBgColor: string;
  shelfBgImage: string;
  shelfOpacity: number;
};

const ShelfRow: React.FC<ShelfRowProps> = ({
  rowIndex,
  columns,
  shelfBgColor,
  shelfBgImage,
  shelfOpacity
}) => {
  // Generate book slots for this row
  const slots = [];
  for (let col = 0; col < columns; col++) {
    const position = rowIndex * columns + col;
    slots.push(
      <BookSlot key={`slot-${rowIndex}-${col}`} position={position} />
    );
  }
  
  return (
    <div className="flex flex-col mb-8">
      <div className="flex justify-center space-x-2">
        {slots}
      </div>
      <div 
        className="wood-shelf h-10 bg-repeat-x bg-bottom bg-contain" 
        style={{ 
          marginLeft: '-8px',
          marginRight: '-8px',
          backgroundColor: shelfBgColor,
          opacity: shelfOpacity,
          backgroundImage: shelfBgImage ? 
            `url(${shelfBgImage})` : 
            'url(/lovable-uploads/1VjId2_iqK82YNtwIi1V4ckXnQEu6jhM3.png)'
        }}
      />
    </div>
  );
};

export default ShelfRow;
