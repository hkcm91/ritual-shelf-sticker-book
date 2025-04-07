
import React from 'react';
import { motion } from 'framer-motion';

interface ShelfBlockProps {
  delay: number;
}

const ShelfBlock: React.FC<ShelfBlockProps> = ({ delay }) => {
  return (
    <motion.div 
      className="w-full"
      layout
      initial={{ scaleY: 0.5, opacity: 0.5 }}
      animate={{ scaleY: 1, opacity: 1 }}
      transition={{ 
        duration: 0.5,
        delay: delay,
        ease: "easeOut" 
      }}
      style={{
        height: 'var(--shelf-thickness, 20px)',
        backgroundColor: 'var(--shelf-color, #2e4600)',
        backgroundImage: 'var(--shelf-texture, none)',
        backgroundSize: 'cover',
        opacity: 'var(--shelf-opacity, 1)',
        boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
        transformOrigin: 'top',
      }}
    />
  );
};

export default ShelfBlock;
