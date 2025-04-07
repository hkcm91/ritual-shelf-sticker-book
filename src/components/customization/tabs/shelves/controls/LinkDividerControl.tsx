
import React from 'react';
import { Label } from "@/components/ui/label";
import { HelpCircle, Link, Link2Off } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Switch } from '@/components/ui/switch';

interface LinkDividerControlProps {
  linkDividerStyling: boolean;
  setLinkDividerStyling: (value: boolean) => void;
}

const LinkDividerControl: React.FC<LinkDividerControlProps> = ({ 
  linkDividerStyling, 
  setLinkDividerStyling 
}) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <Label htmlFor="link-divider-styling" className="text-sm font-medium">Link with Shelf Color</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent side="right" className="max-w-[300px]">
              <p>When enabled, dividers will use the same color as shelves</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="flex items-center gap-2">
        {linkDividerStyling ? (
          <Link className="h-4 w-4 text-primary" />
        ) : (
          <Link2Off className="h-4 w-4 text-muted-foreground" />
        )}
        <Switch 
          id="link-divider-styling"
          checked={linkDividerStyling}
          onCheckedChange={setLinkDividerStyling}
        />
      </div>
    </div>
  );
};

export default LinkDividerControl;
