
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

const HorizontalDividersControl: React.FC = () => {
  const { shelfStyling, toggleDividers, updateDividersSetting } = useBookshelfStore();
  
  const handleToggleHorizontalDividers = (checked: boolean) => {
    // If we're enabling dividers, make sure they're set to horizontal
    if (checked) {
      toggleDividers(true);
      updateDividersSetting('orientation', 'horizontal');
    } else {
      toggleDividers(false);
    }
  };
  
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-amber-200">Horizontal Dividers</h3>
      <p className="text-xs text-amber-200/70 mb-2">
        Toggle horizontal dividers between book rows
      </p>
      
      <div className="flex items-center space-x-2">
        <Switch 
          id="horizontal-dividers" 
          checked={shelfStyling?.dividers?.enabled && 
                 (shelfStyling?.dividers?.orientation === 'horizontal' || 
                  shelfStyling?.dividers?.orientation === 'both')}
          onCheckedChange={handleToggleHorizontalDividers}
          className="data-[state=checked]:bg-amber-600"
        />
        <Label 
          htmlFor="horizontal-dividers"
          className="text-amber-100"
        >
          {shelfStyling?.dividers?.enabled && 
           (shelfStyling?.dividers?.orientation === 'horizontal' || 
            shelfStyling?.dividers?.orientation === 'both') ? 'Visible' : 'Hidden'}
        </Label>
      </div>
      
      {/* Additional divider settings */}
      {shelfStyling?.dividers?.enabled && 
       (shelfStyling?.dividers?.orientation === 'horizontal' || 
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
          <Separator className="h-0.5 w-4 mt-2 bg-amber-500/40" />
          <div>
            <span className="text-xs text-amber-200/70">
              Horizontal dividers create separation between rows
            </span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="inline-block ml-1 h-3 w-3 text-amber-200/50 cursor-help" />
                </TooltipTrigger>
                <TooltipContent side="right" className="bg-amber-950 border-amber-800/50 text-amber-100">
                  <p className="text-xs">Adjust thickness and opacity after enabling</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HorizontalDividersControl;
