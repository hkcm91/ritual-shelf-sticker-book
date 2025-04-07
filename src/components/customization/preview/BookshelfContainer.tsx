
import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import ShelfRow from './ShelfRow';

const BookshelfContainer: React.FC = () => {
  const controls = useAnimation();
  
  // Trigger animation effect on mount and theme changes
  useEffect(() => {
    const triggerAnimation = async () => {
      await controls.start({
        opacity: [0.5, 0.8, 0.2, 0],
        scale: [0.8, 1.2, 1],
        transition: { duration: 1.5, ease: "easeOut" }
      });
    };
    
    triggerAnimation();
  }, [controls]);

  return (
    <motion.div 
      className="preview-container h-full w-full relative"
      layout
      transition={{ duration: 0.5, ease: "easeInOut" }}
      style={{
        backgroundColor: 'var(--container-bg, #2e4600)',
        backgroundImage: 'var(--container-bg-image)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: 'var(--container-opacity, 1)',
        borderWidth: 'var(--container-border-width, 0px)',
        borderStyle: 'var(--container-border-style, solid)',
        borderColor: 'var(--container-border-color, transparent)',
        borderRadius: 'var(--container-border-radius, 0px)',
        padding: 'var(--container-padding, 16px)',
      }}
    >
      <SideDividers />
      
      <div className="flex flex-col h-full justify-between">
        <ShelfRow position="top" />
        <ShelfRow position="bottom" />
      </div>
      
      {/* Theme change indicator - animated pulse at bottom */}
      <motion.div 
        className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500/0 via-amber-500/70 to-amber-500/0"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ 
          scaleX: [0, 1, 1, 0], 
          opacity: [0, 0.7, 0.7, 0],
          transition: { 
            times: [0, 0.2, 0.8, 1],
            duration: 2,
            repeat: 0,
            ease: "easeInOut"
          }
        }}
      />
    </motion.div>
  );
};

// Side dividers component
const SideDividers: React.FC = () => {
  return (
    <>
      <motion.div 
        className="absolute left-0 top-0 bottom-0 pointer-events-none" 
        layout
        transition={{ duration: 0.3 }}
        style={{ 
          display: 'var(--dividers-visible, none)',
          width: 'var(--divider-thickness, 6px)',
          backgroundColor: 'var(--divider-color, #714621)',
          backgroundImage: 'var(--divider-bg-image, none)',
          opacity: 'var(--divider-opacity, 0.8)',
        }}
      />
      <motion.div 
        className="absolute right-0 top-0 bottom-0 pointer-events-none" 
        layout
        transition={{ duration: 0.3 }}
        style={{ 
          display: 'var(--dividers-visible, none)',
          width: 'var(--divider-thickness, 6px)',
          backgroundColor: 'var(--divider-color, #714621)',
          backgroundImage: 'var(--divider-bg-image, none)',
          opacity: 'var(--divider-opacity, 0.8)',
        }}
      />
    </>
  );
};

export default BookshelfContainer;
