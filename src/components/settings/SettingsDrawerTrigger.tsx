
import React from 'react';
import { Button } from "@/components/ui/button";
import { Cog } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SettingsDrawerTriggerProps {
  onClick: () => void;
}

const SettingsDrawerTrigger: React.FC<SettingsDrawerTriggerProps> = ({ onClick }) => {
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    // Ensure event exists and is properly handled
    if (event) {
      // Prevent any default behavior
      event.preventDefault();
      
      console.log("Settings button clicked");
      // Call the provided onClick handler
      onClick();
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="game-btn from-amber-900/40 to-amber-950/40 hover:from-amber-900/50 hover:to-amber-950/50 text-amber-100"
            onClick={handleClick}
          >
            <Cog className="h-4 w-4 animate-[spin_10s_linear_infinite]" />
          </Button>
        </TooltipTrigger>
        <TooltipContent className="bg-[#1A1F2C] border border-amber-600/20 text-amber-100">
          <p>Settings</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default SettingsDrawerTrigger;
