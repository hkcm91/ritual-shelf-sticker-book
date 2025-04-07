
import React from 'react';
import { Button } from "@/components/ui/button";
import { Settings } from 'lucide-react';
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
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-[color:var(--header-text-color,white)] hover:text-[color:var(--header-text-color,white)] hover:bg-[color:var(--header-hover-bg,rgba(255,255,255,0.1))]"
            onClick={() => {
              console.log("Settings button clicked directly");
              onClick();
            }}
          >
            <Settings className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Settings</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default SettingsDrawerTrigger;
