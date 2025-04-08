
import React from 'react';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from '@/components/ui/separator';
import { useBookshelfStore } from '@/store/bookshelfStore';

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
      
      <div className="mt-2 p-2 rounded bg-amber-900/20 border border-amber-700/20">
        <div className="flex items-center gap-2">
          <Separator className="h-0.5 w-4 bg-amber-500/40" />
          <span className="text-xs text-amber-200/70">
            Horizontal dividers create separation between rows
          </span>
        </div>
      </div>
    </div>
  );
};

export default HorizontalDividersControl;
