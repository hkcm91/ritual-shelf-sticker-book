
import React from 'react';
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Palette, Maximize2, Minimize2 } from "lucide-react";
import { AnimatedChild } from '../animations/ModalAnimations';
import { motion } from 'framer-motion';

interface ModalHeaderProps {
  isFullscreen: boolean;
  toggleFullscreen: () => void;
}

const ModalHeader: React.FC<ModalHeaderProps> = ({ 
  isFullscreen, 
  toggleFullscreen 
}) => {
  return (
    <DialogHeader className="flex-row justify-between items-center space-y-0 pb-3 flex-shrink-0 border-b border-amber-900/20">
      <AnimatedChild>
        <DialogTitle className="flex items-center text-xl text-amber-100">
          <div className="relative">
            <Palette className="mr-2.5 h-5 w-5 text-amber-400" />
            <motion.div 
              animate={{ 
                scale: [1, 1.2, 1], 
                opacity: [0.7, 1, 0.7] 
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                repeatType: "reverse" 
              }}
              className="absolute inset-0 bg-amber-400/30 rounded-full blur-md"
            />
          </div>
          <span className="text-gradient-gold font-semibold">Magical Bookshelf Customization</span>
        </DialogTitle>
        <DialogDescription className="text-amber-100/70 mt-1">
          Choose a theme or craft your own magical bookshelf appearance
        </DialogDescription>
      </AnimatedChild>
      
      <AnimatedChild>
        <Button
          variant="outline"
          size="icon"
          onClick={toggleFullscreen}
          className="h-8 w-8 bg-slate-800/50 border-slate-700/50 text-amber-100 hover:bg-slate-700/70 hover:text-amber-200 transition-all duration-300"
          title={isFullscreen ? "Exit fullscreen" : "Fullscreen mode"}
        >
          {isFullscreen ? 
            <Minimize2 className="h-4 w-4" /> : 
            <Maximize2 className="h-4 w-4" />
          }
        </Button>
      </AnimatedChild>
    </DialogHeader>
  );
};

export default ModalHeader;
