
import React from 'react';
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useBookshelfStore } from "@/store/bookshelfStore";

const OrientationControls: React.FC = () => {
  const { 
    shelfStyling, 
    updateDividersSetting
  } = useBookshelfStore();
  
  // Handle orientation change with the correct type
  const handleOrientationChange = (value: string) => {
    updateDividersSetting('orientation', value as 'vertical' | 'horizontal' | 'both');
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Label className="font-medium">Orientation</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Choose how dividers are displayed</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <RadioGroup 
        value={shelfStyling?.dividers?.orientation || 'vertical'} 
        onValueChange={handleOrientationChange}
        className="flex justify-between"
      >
        <div className="flex items-center space-x-2 border rounded-md px-3 py-2 hover:bg-accent">
          <RadioGroupItem value="vertical" id="vertical" />
          <Label htmlFor="vertical" className="cursor-pointer">Vertical</Label>
        </div>
        <div className="flex items-center space-x-2 border rounded-md px-3 py-2 hover:bg-accent">
          <RadioGroupItem value="horizontal" id="horizontal" />
          <Label htmlFor="horizontal" className="cursor-pointer">Horizontal</Label>
        </div>
        <div className="flex items-center space-x-2 border rounded-md px-3 py-2 hover:bg-accent">
          <RadioGroupItem value="both" id="both" />
          <Label htmlFor="both" className="cursor-pointer">Both</Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default OrientationControls;
