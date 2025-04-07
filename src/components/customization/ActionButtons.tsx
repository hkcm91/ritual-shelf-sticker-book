
import React from 'react';
import { Button } from "@/components/ui/button";
import { Save, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface ActionButtonsProps {
  className?: string;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ className }) => {
  return (
    <div className={cn("flex justify-between items-center", className)}>
      <Button
        variant="outline"
        size="sm"
        className="bg-slate-800/50 border-slate-700/50 text-amber-100 hover:bg-slate-700 hover:text-amber-200 group"
      >
        <RotateCcw className="mr-1.5 h-4 w-4 group-hover:animate-spin" />
        Reset this section
      </Button>
      
      <Button
        variant="default"
        size="sm"
        className="bg-gradient-to-r from-amber-600/90 to-amber-500/80 hover:from-amber-500/90 hover:to-amber-600/80 text-white border-none shadow-md relative group overflow-hidden"
      >
        <span className="absolute inset-0 w-full bg-gradient-to-r from-amber-400/0 via-amber-400/40 to-amber-400/0 opacity-0 group-hover:opacity-100 transform -translate-x-full group-hover:translate-x-full transition-all duration-1000" />
        <Save className="mr-1.5 h-4 w-4 relative z-10" />
        <span className="relative z-10">Apply Changes</span>
      </Button>
    </div>
  );
};

export default ActionButtons;
