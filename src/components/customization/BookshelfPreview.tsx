
import React from 'react';
import { motion } from 'framer-motion';

const BookshelfPreview: React.FC = () => {
  return (
    <motion.div 
      className="relative w-full rounded overflow-hidden border shadow-sm" 
      style={{ height: '240px' }}
      key="bookshelf-preview"
      initial={{ opacity: 0.7 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
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
                  transition={{ duration: 0.3, delay: 0.1 * slotIndex }}
                  initial={{ opacity: 0, height: '50px' }}
                  animate={{ 
                    opacity: slotIndex === 2 ? 'var(--divider-opacity, 0.8)' : 0.3,
                    height: '60px'
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
              transition={{ 
                duration: 0.5,
                ease: "easeInOut" 
              }}
              style={{
                height: 'var(--shelf-thickness, 20px)',
                backgroundColor: 'var(--shelf-color, #2e4600)',
                backgroundImage: 'var(--shelf-texture, none)',
                backgroundSize: 'cover',
                opacity: 'var(--shelf-opacity, 1)',
                boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
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
                  transition={{ duration: 0.3, delay: 0.1 * slotIndex + 0.2 }}
                  initial={{ opacity: 0, height: '50px' }}
                  animate={{ 
                    opacity: slotIndex === 2 ? 'var(--divider-opacity, 0.8)' : 0.3,
                    height: '60px'
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
              transition={{ 
                duration: 0.5,
                ease: "easeInOut" 
              }}
              style={{
                height: 'var(--shelf-thickness, 20px)',
                backgroundColor: 'var(--shelf-color, #2e4600)',
                backgroundImage: 'var(--shelf-texture, none)',
                backgroundSize: 'cover',
                opacity: 'var(--shelf-opacity, 1)',
                boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
              }}
            />
          </div>
        </div>
        
        {/* Sparkling effect for theme changes */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0.5 }}
          animate={{ 
            opacity: [0.5, 0.3, 0.2, 0], 
            backgroundPosition: ['0% 0%', '100% 100%'] 
          }}
          transition={{ 
            duration: 1.5,
            ease: "easeOut",
            times: [0, 0.3, 0.6, 1],
            repeat: 0
          }}
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%)',
            backgroundSize: '120px 120px',
            backgroundRepeat: 'no-repeat',
            mixBlendMode: 'overlay'
          }}
        />
      </motion.div>
    </motion.div>
  );
};

export default BookshelfPreview;
