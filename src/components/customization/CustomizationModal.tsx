
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Palette, Maximize2, Minimize2, Save, RotateCcw } from "lucide-react";
import { useBookshelfStore } from "@/store/bookshelfStore";
import CustomizationContent from './CustomizationContent';
import BookshelfPreview from './BookshelfPreview';
import { toast } from 'sonner';
import { motion, AnimatePresence } from "framer-motion";

export interface CustomizationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CustomizationModal: React.FC<CustomizationModalProps> = ({ 
  open,
  onOpenChange
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { saveCustomization, resetCustomization } = useBookshelfStore();

  const handleSave = () => {
    saveCustomization();
    toast.success("Customization saved successfully", {
      icon: "💾",
      position: "bottom-center",
      duration: 2000,
    });
  };

  const handleReset = () => {
    if (confirm("Are you sure you want to reset all customization settings? This cannot be undone.")) {
      resetCustomization();
      toast.success("Customization reset to defaults", {
        icon: "🔄",
        position: "bottom-center",
      });
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <AnimatePresence>
      {open && (
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent 
            className={`${isFullscreen ? 'max-w-[95vw] h-[95vh] max-h-[95vh]' : 'max-w-3xl max-h-[80vh]'} 
              transition-all duration-300 flex flex-col bg-gradient-to-b from-slate-950/95 to-slate-900/95 border-amber-950/30`}
            style={{ minWidth: isFullscreen ? '95vw' : 'auto' }}
          >
            <DialogHeader className="flex-row justify-between items-center space-y-0 pb-2 flex-shrink-0 border-b border-amber-900/20">
              <div>
                <DialogTitle className="flex items-center text-xl text-amber-100">
                  <Palette className="mr-2 h-5 w-5 text-amber-400" /> 
                  <span className="text-gradient-gold">Bookshelf Customization</span>
                </DialogTitle>
                <DialogDescription className="text-amber-100/70">
                  Choose a theme or customize the appearance of your magical bookshelf
                </DialogDescription>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={toggleFullscreen}
                className="h-8 w-8 bg-slate-800/50 border-slate-700/50 text-amber-100 hover:bg-slate-700/70 hover:text-amber-200"
                title={isFullscreen ? "Exit fullscreen" : "Fullscreen mode"}
              >
                {isFullscreen ? 
                  <Minimize2 className="h-4 w-4" /> : 
                  <Maximize2 className="h-4 w-4" />
                }
              </Button>
            </DialogHeader>
            
            {/* Live Preview Section - Updated */}
            <motion.div 
              className="mb-4 rounded-md p-3 bg-slate-900/60 flex-shrink-0 border border-amber-900/20 mt-3"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h4 className="text-sm font-medium mb-2 flex items-center text-amber-100">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></span>
                Live Preview
              </h4>
              <BookshelfPreview />
            </motion.div>
            
            <div className="overflow-y-auto flex-1 pr-1">
              <CustomizationContent />
            </div>
            
            <DialogFooter className="flex justify-between mt-4 pt-2 border-t border-amber-900/20 space-x-2 flex-shrink-0">
              <div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReset}
                  className="flex items-center bg-slate-800/50 border-slate-700/50 text-amber-100 hover:bg-slate-700 hover:text-amber-200"
                >
                  <RotateCcw className="mr-1 h-4 w-4" />
                  Reset to Defaults
                </Button>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleSave}
                  className="flex items-center bg-amber-600/80 hover:bg-amber-600 text-white border-none"
                >
                  <Save className="mr-1 h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default CustomizationModal;
