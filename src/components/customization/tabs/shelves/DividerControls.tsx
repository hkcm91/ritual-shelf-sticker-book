
import React from 'react';
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { useBookshelfStore } from "@/store/bookshelfStore";
import { HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface DividerControlsProps {
  linkDividerStyling: boolean;
}

const DividerControls: React.FC<DividerControlsProps> = ({ 
  linkDividerStyling 
}) => {
  const { 
    shelfStyling, 
    updateDividersSetting
  } = useBookshelfStore();
  
  // Handle orientation change with the correct type
  const handleOrientationChange = (value: string) => {
    updateDividersSetting('orientation', value as 'vertical' | 'horizontal' | 'both');
  };

  // Handle books per row change with the correct type
  const handleBooksPerRowChange = (value: number) => {
    updateDividersSetting('booksPerRow', value);
  };
  
  return (
    <>
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Label className="font-medium">Divider Orientation</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Choose how dividers should be displayed on your bookshelf</p>
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label>Books Per Section</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Number of books between vertical dividers</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Input
            type="number"
            min={2}
            max={10}
            value={shelfStyling?.dividers?.booksPerSection || 6}
            onChange={(e) => updateDividersSetting('booksPerSection', parseInt(e.target.value))}
            className="w-full"
            disabled={!['vertical', 'both'].includes(shelfStyling?.dividers?.orientation || 'vertical')}
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label>Books Per Row</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Number of books between horizontal dividers</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Input
            type="number"
            min={1}
            max={10}
            value={shelfStyling?.dividers?.booksPerRow || 2}
            onChange={(e) => handleBooksPerRowChange(parseInt(e.target.value))}
            className="w-full"
            disabled={!['horizontal', 'both'].includes(shelfStyling?.dividers?.orientation || 'vertical')}
          />
        </div>
      </div>
      
      <div className="space-y-2 mt-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Label>Divider Thickness</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Width of divider lines in pixels</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <span className="text-sm font-medium">{shelfStyling?.dividers?.thickness || 2}px</span>
        </div>
        <Slider
          value={[shelfStyling?.dividers?.thickness || 2]}
          min={1}
          max={12}
          step={1}
          onValueChange={(value) => updateDividersSetting('thickness', value[0])}
        />
      </div>
      
      <div className="space-y-2 mt-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Label>Divider Opacity</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Transparency of dividers</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <span className="text-sm font-medium">{Math.round((shelfStyling?.dividers?.opacity || 1) * 100)}%</span>
        </div>
        <Slider
          value={[(shelfStyling?.dividers?.opacity || 1) * 100]}
          min={20}
          max={100}
          step={5}
          onValueChange={(value) => updateDividersSetting('opacity', value[0] / 100)}
        />
      </div>
    </>
  );
};

export default DividerControls;
