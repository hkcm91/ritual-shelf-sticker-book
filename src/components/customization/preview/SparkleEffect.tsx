
import React, { useEffect } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';

interface SparkleEffectProps {
  sparkPosition: { x: number; y: number };
}

const SparkleEffect: React.FC<SparkleEffectProps> = ({ sparkPosition }) => {
  const controls = useAnimation();
  
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
  }, [controls, sparkPosition.x, sparkPosition.y]);
  
  return (
    <AnimatePresence>
      {/* Interactive sparkle effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-10"
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
        className="absolute inset-0 opacity-0 hover:opacity-20 transition-opacity duration-300 pointer-events-none z-10"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,215,0,0.5) 0%, rgba(255,215,0,0) 70%)',
          backgroundSize: '180px 180px',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: `${sparkPosition.x}% ${sparkPosition.y}%`,
          mixBlendMode: 'overlay'
        }}
      />
    </AnimatePresence>
  );
};

export default SparkleEffect;
