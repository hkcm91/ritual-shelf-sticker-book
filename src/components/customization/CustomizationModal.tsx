
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
import { Palette, Maximize2, Minimize2, Save, RotateCcw, Sparkles } from "lucide-react";
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
  const [showSaveAnimation, setShowSaveAnimation] = useState(false);
  const { saveCustomization, resetCustomization } = useBookshelfStore();

  const handleSave = () => {
    saveCustomization();
    setShowSaveAnimation(true);
    setTimeout(() => setShowSaveAnimation(false), 2000);
    
    toast.success("Your magical bookshelf customization has been saved!", {
      icon: "💾",
      position: "bottom-center",
      duration: 3000,
      style: {
        background: "linear-gradient(to right, #614385, #516395)",
        color: "white",
        border: "1px solid rgba(255,255,255,0.1)",
      }
    });
  };

  const handleReset = () => {
    if (confirm("Are you sure you want to reset all customization settings to their magical defaults? This spell cannot be undone.")) {
      resetCustomization();
      toast.success("Your bookshelf has been restored to its original enchantment", {
        icon: "🔮",
        position: "bottom-center",
        style: {
          background: "linear-gradient(to right, #614385, #516395)",
          color: "white",
          border: "1px solid rgba(255,255,255,0.1)",
        }
      });
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Animation variants
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 10 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.165, 0.84, 0.44, 1],
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.95, 
      y: 10,
      transition: {
        duration: 0.3,
        ease: [0.165, 0.84, 0.44, 1]
      }
    }
  };

  const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.165, 0.84, 0.44, 1]
      }
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent 
            className={`${isFullscreen ? 'max-w-[95vw] h-[95vh] max-h-[95vh]' : 'max-w-4xl max-h-[90vh]'} 
              transition-all duration-500 flex flex-col bg-gradient-to-b from-slate-950/95 to-slate-900/95 border-amber-950/30
              backdrop-blur-md relative overflow-hidden`}
            style={{ 
              minWidth: isFullscreen ? '95vw' : 'auto',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.45)'
            }}
          >
            {/* Background subtle animation */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-950/50 via-slate-900/50 to-slate-800/50 z-0 overflow-hidden">
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
            </div>
            
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="relative z-10 flex flex-col h-full"
            >
              <DialogHeader className="flex-row justify-between items-center space-y-0 pb-3 flex-shrink-0 border-b border-amber-900/20">
                <motion.div variants={childVariants}>
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
                </motion.div>
                
                <motion.div variants={childVariants}>
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
                </motion.div>
              </DialogHeader>
              
              {/* Live Preview Section */}
              <motion.div 
                variants={childVariants}
                className="mb-4 rounded-lg p-4 bg-slate-900/60 flex-shrink-0 border border-amber-900/20 mt-4 relative overflow-hidden"
              >
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
              </motion.div>
              
              <motion.div 
                variants={childVariants}
                className="overflow-y-auto flex-1 pr-1 relative"
              >
                <CustomizationContent />
              </motion.div>
              
              <motion.div variants={childVariants}>
                <DialogFooter className="flex justify-between mt-4 pt-3 border-t border-amber-900/20 space-x-2 flex-shrink-0">
                  <div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleReset}
                      className="flex items-center bg-slate-800/50 border-slate-700/50 text-amber-100 hover:bg-slate-700 hover:text-amber-200 group relative overflow-hidden"
                    >
                      <span className="absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-to-r from-red-500/20 via-red-500/10 to-transparent transition-opacity" />
                      <RotateCcw className="mr-1.5 h-4 w-4 group-hover:animate-spin" />
                      <span className="relative z-10">Reset to Defaults</span>
                    </Button>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      variant="default"
                      size="sm"
                      onClick={handleSave}
                      className="flex items-center bg-gradient-to-r from-amber-600/90 to-amber-500/80 hover:from-amber-500/90 hover:to-amber-600/80 text-white border-none shadow-md relative group overflow-hidden"
                    >
                      <span className="absolute inset-0 w-full bg-gradient-to-r from-amber-400/0 via-amber-400/40 to-amber-400/0 opacity-0 group-hover:opacity-100 transform -translate-x-full group-hover:translate-x-full transition-all duration-1000" />
                      <Save className="mr-1.5 h-4 w-4 relative z-10" />
                      <span className="relative z-10">Save Changes</span>
                    </Button>
                  </div>
                </DialogFooter>
              </motion.div>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default CustomizationModal;
