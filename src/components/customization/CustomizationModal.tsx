
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Palette } from "lucide-react";
import { useBookshelfStore } from "@/store/bookshelfStore";
import CustomizationContent from './CustomizationContent';

export interface CustomizationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CustomizationModal: React.FC<CustomizationModalProps> = ({ 
  open,
  onOpenChange
}) => {
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
      </DialogContent>
    </Dialog>
  );
};

export default CustomizationModal;
