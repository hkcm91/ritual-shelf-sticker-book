
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import BookshelfContainer from './preview/BookshelfContainer';
import SparkleEffect from './preview/SparkleEffect';

const BookshelfPreview: React.FC = () => {
  const [sparkPosition, setSparkPosition] = useState({ x: 50, y: 50 });
  
  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setSparkPosition({ x, y });
  };

  return (
    <motion.div 
      className="relative w-full rounded-lg overflow-hidden border shadow-lg h-[240px] md:h-[280px] lg:h-[240px]" 
      key="bookshelf-preview"
      initial={{ opacity: 0.7 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      onMouseMove={handleMouseMove}
    >
      <BookshelfContainer />
      <SparkleEffect sparkPosition={sparkPosition} />
    </motion.div>
  );
};

export default BookshelfPreview;
