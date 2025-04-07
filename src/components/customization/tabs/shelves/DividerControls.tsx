
import React from 'react';
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { useBookshelfStore } from "@/store/bookshelfStore";
import { HelpCircle, Link, Link2Off } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Switch } from '@/components/ui/switch';

interface DividerControlsProps {
  linkDividerStyling: boolean;
  setLinkDividerStyling: (value: boolean) => void;
}

const DividerControls: React.FC<DividerControlsProps> = ({ 
  linkDividerStyling, 
  setLinkDividerStyling 
}) => {
  const { 
    shelfStyling, 
    updateDividersSetting
  } = useBookshelfStore();
  
  // Handle orientation change with the correct type
  const handleOrientationChange = (value: string) => {
    updateDividersSetting('orientation', value as 'vertical' | 'horizontal' | 'both');
  };

  return (
    <>
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
      
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="space-y-2">
          <Label>Books Per Section</Label>
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
          <Label>Books Per Row</Label>
          <Input
            type="number"
            min={1}
            max={10}
            value={shelfStyling?.dividers?.booksPerRow || 2}
            onChange={(e) => updateDividersSetting('booksPerRow', parseInt(e.target.value))}
            className="w-full"
            disabled={!['horizontal', 'both'].includes(shelfStyling?.dividers?.orientation || 'vertical')}
          />
        </div>
      </div>
      
      <div className="space-y-2 mt-4">
        <div className="flex justify-between items-center">
          <Label>Thickness</Label>
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
          <Label>Opacity</Label>
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
