
import React from 'react';
import { motion } from 'framer-motion';

interface BookPlaceholdersProps {
  position: 'top' | 'bottom';
  delay: number;
}

const BookPlaceholders: React.FC<BookPlaceholdersProps> = ({ position, delay }) => {
  return (
    <div className="flex justify-around mb-1">
      {[1, 2, 3].map((slotIndex) => (
        <motion.div 
          key={`preview-slot-${position}-${slotIndex}`}
          className="rounded-sm mx-2"
          layout
          initial={{ opacity: 0, height: 0 }}
          animate={{ 
            opacity: slotIndex === 2 ? 'var(--divider-opacity, 0.8)' : 0.4,
            height: '60px'
          }}
          transition={{ 
            duration: 0.5, 
            delay: delay + (0.1 * slotIndex),
            ease: "easeOut" 
          }}
          style={{
            backgroundColor: slotIndex === 2 ? 'var(--divider-color, #714621)' : '#adadad30',
            width: slotIndex === 2 ? 'var(--divider-thickness, 6px)' : '24px',
            display: slotIndex === 2 ? 'var(--dividers-visible, block)' : 'block',
          }}
        />
      ))}
    </div>
  );
};

export default BookPlaceholders;
