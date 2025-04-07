
import React from 'react';
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Save, RotateCcw } from "lucide-react";
import { AnimatedChild } from '../animations/ModalAnimations';

interface ModalFooterProps {
  handleSave: () => void;
  handleReset: () => void;
}

const ModalFooter: React.FC<ModalFooterProps> = ({ handleSave, handleReset }) => {
  return (
    <AnimatedChild>
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
    </AnimatedChild>
  );
};

export default ModalFooter;
