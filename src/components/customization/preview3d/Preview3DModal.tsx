
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { motion } from 'framer-motion';
import ThreeDBookshelf from './ThreeDBookshelf';
import { Maximize2, Minimize2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Preview3DModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const Preview3DModal: React.FC<Preview3DModalProps> = ({ open, onOpenChange }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  console.log("[Preview3DModal] Rendering with open state:", open);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Force a specific z-index here
  useEffect(() => {
    if (open) {
      // Find any open dialogs and set their z-index
      const dialogOverlays = document.querySelectorAll('[data-radix-dialog-overlay]');
      const dialogContents = document.querySelectorAll('[data-radix-dialog-content]');
      
      dialogOverlays.forEach(overlay => {
        if (overlay.parentElement?.hasAttribute('data-preview-3d')) {
          (overlay as HTMLElement).style.zIndex = '999';
        }
      });
      
      dialogContents.forEach(content => {
        if (content.parentElement?.parentElement?.hasAttribute('data-preview-3d')) {
          (content as HTMLElement).style.zIndex = '1000';
        }
      });
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange} data-preview-3d="true">
      <DialogContent 
        className={`${isFullscreen ? 'max-w-[95vw] h-[95vh] p-6' : 'max-w-4xl p-6'} 
          bg-gradient-to-b from-slate-950/95 to-slate-900/95 border-amber-950/30
          backdrop-blur-md overflow-hidden transition-all duration-300`}
        style={{ 
          minWidth: isFullscreen ? '95vw' : 'auto',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.45)',
          zIndex: 1000 // Force a high z-index
        }}
        hideCloseButton={true}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-gradient-to-br from-slate-950/50 via-slate-900/50 to-slate-800/50 z-0"
        >
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
        </motion.div>
        
        <div className="relative z-10 flex flex-col h-full">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-amber-50">3D Bookshelf Preview</h2>
            <div className="flex gap-2">
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
                onClick={() => onOpenChange(false)}
                className="text-amber-100 hover:bg-amber-800/20 hover:text-amber-50"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          {/* 3D Preview */}
          <div className="flex-1 relative rounded-lg overflow-hidden border border-amber-900/30 bg-slate-900/60">
            <div className="absolute inset-0">
              <ThreeDBookshelf />
            </div>
            
            <div className="absolute bottom-4 left-0 right-0 text-center text-amber-100/70 text-xs">
              <p>Click and drag to rotate • Scroll to zoom</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Preview3DModal;
