
import React, { useState } from 'react';
import { Sparkles } from "lucide-react";
import { AnimatedChild } from '../animations/ModalAnimations';
import BookshelfPreview from '../BookshelfPreview';
import { motion, AnimatePresence } from 'framer-motion';
import { Save } from 'lucide-react';

interface PreviewSectionProps {
  showSaveAnimation: boolean;
}

const PreviewSection: React.FC<PreviewSectionProps> = ({ showSaveAnimation }) => {
  return (
    <AnimatedChild className="mb-4 rounded-lg p-4 bg-slate-900/60 flex-shrink-0 border border-amber-900/20 mt-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-amber-950/10 via-transparent to-amber-950/10" />
      
      <h4 className="text-sm font-medium mb-2 flex items-center text-amber-100">
        <motion.span 
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            repeatType: "reverse" 
          }}
          className="w-2 h-2 bg-green-500 rounded-full mr-2"
        />
        <span>Live Preview</span>
        <Sparkles className="h-3.5 w-3.5 ml-1.5 text-amber-400/90" />
      </h4>
      
      <BookshelfPreview />
      
      {/* Save animation overlay */}
      <AnimatePresence>
        {showSaveAnimation && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 bg-amber-500/20 backdrop-blur-sm flex items-center justify-center z-20"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.1, opacity: 0 }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 15 
              }}
              className="bg-gradient-to-r from-amber-600/90 to-amber-500/90 p-4 rounded-lg shadow-lg flex items-center gap-3"
            >
              <Save className="h-6 w-6 text-white" />
              <span className="text-white font-medium">Magic saved successfully!</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AnimatedChild>
  );
};

export default PreviewSection;
