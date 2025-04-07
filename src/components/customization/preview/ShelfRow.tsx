
import React from 'react';
import { motion } from 'framer-motion';
import BookPlaceholders from './BookPlaceholders';
import ShelfBlock from './ShelfBlock';

interface ShelfRowProps {
  position: 'top' | 'bottom';
}

const ShelfRow: React.FC<ShelfRowProps> = ({ position }) => {
  const delay = position === 'top' ? 0 : 0.2;
  
  return (
    <motion.div 
      className="mb-4 relative"
      initial={{ opacity: 0, y: position === 'top' ? -10 : 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
    >
      <BookPlaceholders position={position} delay={delay} />
      <ShelfBlock delay={delay} />
    </motion.div>
  );
};

export default ShelfRow;
