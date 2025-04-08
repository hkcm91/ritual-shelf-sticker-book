
import React from 'react';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from '@/components/ui/separator';
import { useBookshelfStore } from '@/store/bookshelfStore';
import { Slider } from "@/components/ui/slider";
import { HelpCircle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const VerticalDividersControl: React.FC = () => {
  const { shelfStyling, toggleDividers, updateDividersSetting } = useBookshelfStore();
  
  const handleToggleVerticalDividers = (checked: boolean) => {
    // If we're enabling dividers, make sure they're set to vertical
    if (checked) {
      toggleDividers(true);
      updateDividersSetting('orientation', 'vertical');
    } else {
      toggleDividers(false);
    }
  };
  
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-amber-200">Vertical Dividers</h3>
      <p className="text-xs text-amber-200/70 mb-2">
        Toggle vertical dividers between book slots
      </p>
      
      <div className="flex items-center space-x-2">
        <Switch 
          id="vertical-dividers" 
          checked={shelfStyling?.dividers?.enabled && 
                 (shelfStyling?.dividers?.orientation === 'vertical' || 
                  shelfStyling?.dividers?.orientation === 'both')}
          onCheckedChange={handleToggleVerticalDividers}
          className="data-[state=checked]:bg-amber-600"
        />
        <Label 
          htmlFor="vertical-dividers"
          className="text-amber-100"
        >
          {shelfStyling?.dividers?.enabled && 
           (shelfStyling?.dividers?.orientation === 'vertical' || 
            shelfStyling?.dividers?.orientation === 'both') ? 'Visible' : 'Hidden'}
        </Label>
      </div>
      
      {/* Additional divider settings */}
      {shelfStyling?.dividers?.enabled && 
       (shelfStyling?.dividers?.orientation === 'vertical' || 
        shelfStyling?.dividers?.orientation === 'both') && (
        <div className="mt-3 space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label className="text-sm text-amber-200">Thickness</Label>
              <span className="text-xs text-amber-200">{shelfStyling.dividers.thickness}px</span>
            </div>
            <Slider
              value={[shelfStyling.dividers.thickness]}
              min={1}
              max={10}
              step={1}
              onValueChange={(value) => updateDividersSetting('thickness', value[0])}
              className="[&_[role=slider]]:bg-amber-500"
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label className="text-sm text-amber-200">Height</Label>
              <span className="text-xs text-amber-200">{shelfStyling.dividers.height}px</span>
            </div>
            <Slider
              value={[shelfStyling.dividers.height]}
              min={100}
              max={300}
              step={10}
              onValueChange={(value) => updateDividersSetting('height', value[0])}
              className="[&_[role=slider]]:bg-amber-500"
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label className="text-sm text-amber-200">Opacity</Label>
              <span className="text-xs text-amber-200">{Math.round(shelfStyling.dividers.opacity * 100)}%</span>
            </div>
            <Slider
              value={[shelfStyling.dividers.opacity * 100]}
              min={10}
              max={100}
              step={5}
              onValueChange={(value) => updateDividersSetting('opacity', value[0] / 100)}
              className="[&_[role=slider]]:bg-amber-500"
            />
          </div>
        </div>
      )}
      
      <div className="mt-2 p-2 rounded bg-amber-900/20 border border-amber-700/20">
        <div className="flex items-start gap-2">
          <Separator orientation="vertical" className="h-4 w-0.5 mt-0.5 bg-amber-500/40" />
          <div>
            <span className="text-xs text-amber-200/70">
              Vertical dividers create a more organized look between columns
            </span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="inline-block ml-1 h-3 w-3 text-amber-200/50 cursor-help" />
                </TooltipTrigger>
                <TooltipContent side="right" className="bg-amber-950 border-amber-800/50 text-amber-100">
                  <p className="text-xs">Adjust thickness, height, and opacity after enabling</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerticalDividersControl;
