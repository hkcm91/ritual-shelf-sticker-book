
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useBookshelfStore } from "@/store/bookshelfStore";
import { Palette, CircleOff } from "lucide-react";
import CustomizationContent from './CustomizationContent';

export interface CustomizationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CustomizationModal: React.FC<CustomizationModalProps> = ({ 
  open,
  onOpenChange
}) => {
  // Get store actions
  const { saveCustomization, resetCustomization } = useBookshelfStore();
  
  const handleSave = () => {
    saveCustomization();
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            <Palette className="mr-2 h-5 w-5" /> 
            Ritual Shelf Customization
          </DialogTitle>
          <DialogDescription>
            Choose a theme or customize the appearance of your bookshelf
          </DialogDescription>
        </DialogHeader>
        
        <CustomizationContent />
        
        <DialogFooter className="flex justify-between mt-6">
          <Button 
            variant="outline" 
            onClick={resetCustomization}
          >
            <CircleOff className="mr-2 h-4 w-4" />
            Reset to Defaults
          </Button>
          
          <Button 
            onClick={handleSave}
          >
            <Palette className="mr-2 h-4 w-4" />
            Save Customization
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CustomizationModal;
