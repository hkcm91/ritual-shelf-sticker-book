
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Palette, ArrowsMaximize, ArrowsMinimize, Save, RotateCcw } from "lucide-react";
import { useBookshelfStore } from "@/store/bookshelfStore";
import CustomizationContent from './CustomizationContent';
import { toast } from 'sonner';

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
    toast.success("Customization saved successfully");
  };

  const handleReset = () => {
    if (confirm("Are you sure you want to reset all customization settings? This cannot be undone.")) {
      resetCustomization();
      toast.success("Customization reset to defaults");
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className={`${isFullscreen ? 'max-w-[95vw] h-[95vh] max-h-[95vh]' : 'max-w-3xl max-h-[80vh]'} transition-all duration-300`}
        style={{ minWidth: isFullscreen ? '95vw' : 'auto' }}
      >
        <DialogHeader className="flex-row justify-between items-center space-y-0 pb-2">
          <div>
            <DialogTitle className="flex items-center text-xl">
              <Palette className="mr-2 h-5 w-5" /> 
              Ritual Shelf Customization
            </DialogTitle>
            <DialogDescription>
              Choose a theme or customize the appearance of your bookshelf
            </DialogDescription>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={toggleFullscreen}
            className="h-8 w-8"
            title={isFullscreen ? "Exit fullscreen" : "Fullscreen mode"}
          >
            {isFullscreen ? 
              <ArrowsMinimize className="h-4 w-4" /> : 
              <ArrowsMaximize className="h-4 w-4" />
            }
          </Button>
        </DialogHeader>
        
        <div className="overflow-y-auto flex-1 pr-1">
          <CustomizationContent />
        </div>
        
        <DialogFooter className="flex justify-between mt-4 pt-2 border-t space-x-2">
          <div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="flex items-center"
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
              className="flex items-center"
            >
              <Save className="mr-1 h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CustomizationModal;
