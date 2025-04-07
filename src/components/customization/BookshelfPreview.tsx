
import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';

const BookshelfPreview: React.FC = () => {
  const controls = useAnimation();
  const [sparkPosition, setSparkPosition] = useState({ x: 50, y: 50 });
  
  // Trigger sparkling effect on mount and theme changes
  useEffect(() => {
    const triggerSparkle = async () => {
      await controls.start({
        opacity: [0.5, 0.8, 0.2, 0],
        scale: [0.8, 1.2, 1],
        transition: { duration: 1.5, ease: "easeOut" }
      });
    };
    
    triggerSparkle();
  }, [controls]);
  
  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setSparkPosition({ x, y });
  };

  return (
    <motion.div 
      className="relative w-full rounded-lg overflow-hidden border shadow-md" 
      style={{ height: '240px' }}
      key="bookshelf-preview"
      initial={{ opacity: 0.7 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      onMouseMove={handleMouseMove}
    >
      {/* Container with customizable properties */}
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
        {/* Side dividers if enabled */}
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
        
        <div className="flex flex-col h-full justify-between">
          {/* First Shelf Row */}
          <div className="mb-4 relative">
            {/* Book placeholders */}
            <div className="flex justify-around mb-1">
              {[1, 2, 3].map((slotIndex) => (
                <motion.div 
                  key={`preview-slot-top-${slotIndex}`}
                  className="rounded-sm mx-2"
                  layout
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ 
                    opacity: slotIndex === 2 ? 'var(--divider-opacity, 0.8)' : 0.4,
                    height: '60px'
                  }}
                  transition={{ 
                    duration: 0.5, 
                    delay: 0.1 * slotIndex,
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
            
            {/* Shelf */}
            <motion.div 
              className="w-full"
              layout
              initial={{ scaleY: 0.5, opacity: 0.5 }}
              animate={{ scaleY: 1, opacity: 1 }}
              transition={{ 
                duration: 0.5,
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
          </div>
          
          {/* Second Shelf Row */}
          <div className="relative mb-4">
            {/* Book placeholders */}
            <div className="flex justify-around mb-1">
              {[1, 2, 3].map((slotIndex) => (
                <motion.div 
                  key={`preview-slot-bottom-${slotIndex}`}
                  className="rounded-sm mx-2"
                  layout
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ 
                    opacity: slotIndex === 2 ? 'var(--divider-opacity, 0.8)' : 0.4,
                    height: '60px'
                  }}
                  transition={{ 
                    duration: 0.5, 
                    delay: 0.2 + (0.1 * slotIndex),
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
            
            {/* Shelf */}
            <motion.div 
              className="w-full"
              layout
              initial={{ scaleY: 0.5, opacity: 0.5 }}
              animate={{ scaleY: 1, opacity: 1 }}
              transition={{ 
                duration: 0.5,
                delay: 0.1,
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
          </div>
        </div>
        
        {/* Interactive sparkle effect */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={controls}
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%)',
            backgroundSize: '120px 120px',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: `${sparkPosition.x}% ${sparkPosition.y}%`,
            mixBlendMode: 'overlay'
          }}
        />
        
        {/* Hover highlight effect */}
        <motion.div
          className="absolute inset-0 opacity-0 hover:opacity-20 transition-opacity duration-300 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,215,0,0.5) 0%, rgba(255,215,0,0) 70%)',
            backgroundSize: '180px 180px',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: `${sparkPosition.x}% ${sparkPosition.y}%`,
            mixBlendMode: 'overlay'
          }}
        />
        
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
    </motion.div>
  );
};

export default BookshelfPreview;
