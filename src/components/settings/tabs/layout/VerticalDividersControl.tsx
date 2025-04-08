
import React from 'react';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from '@/components/ui/separator';
import { useBookshelfStore } from '@/store/bookshelfStore';

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
      
      <div className="mt-2 p-2 rounded bg-amber-900/20 border border-amber-700/20">
        <div className="flex items-center gap-2">
          <Separator orientation="vertical" className="h-4 w-0.5 bg-amber-500/40" />
          <span className="text-xs text-amber-200/70">
            Vertical dividers create a more organized look between columns
          </span>
        </div>
      </div>
    </div>
  );
};

export default VerticalDividersControl;
