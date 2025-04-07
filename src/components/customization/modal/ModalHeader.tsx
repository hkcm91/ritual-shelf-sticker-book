
import React from 'react';
import { Maximize2, Minimize2, X, Palette, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedChild } from '../animations/ModalAnimations';
import Preview3DButton from '../Preview3DButton';

interface ModalHeaderProps {
  isFullscreen: boolean;
  toggleFullscreen: () => void;
}

const ModalHeader: React.FC<ModalHeaderProps> = ({ 
  isFullscreen, 
  toggleFullscreen 
}) => {
  return (
    <AnimatedChild className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <Palette className="h-5 w-5 text-amber-400/90" />
        <h2 className="text-xl font-semibold text-amber-50 flex items-center gap-1.5">
          Bookshelf Customization 
          <Sparkles className="h-4 w-4 text-amber-300/90" />
        </h2>
      </div>
      
      <div className="flex items-center gap-3">
        <Preview3DButton />
        
        <div className="flex">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleFullscreen} 
            className="text-amber-100 hover:bg-amber-800/20 hover:text-amber-50"
          >
            {isFullscreen ? 
              <Minimize2 className="h-5 w-5" /> : 
              <Maximize2 className="h-5 w-5" />
            }
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            type="button"
            className="text-amber-100 hover:bg-amber-800/20 hover:text-amber-50"
            onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', {key: 'Escape'}))}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </AnimatedChild>
  );
};

export default ModalHeader;
