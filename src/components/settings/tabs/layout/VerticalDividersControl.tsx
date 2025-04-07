
import React, { useState, useEffect } from 'react';
import { Divide } from 'lucide-react';
import { useBookshelfStore } from '@/store/bookshelfStore';
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import DividerAppearanceSliders from '@/components/customization/tabs/shelves/controls/DividerAppearanceSliders';

const VerticalDividersControl: React.FC = () => {
  const {
    shelfStyling,
    toggleDividers,
    updateDividersSetting
  } = useBookshelfStore();
  
  const [verticalDividersEnabled, setVerticalDividersEnabled] = useState(false);
  const [booksPerSection, setBooksPerSection] = useState(4);
  
  // Initialize state from shelf styling
  useEffect(() => {
    if (shelfStyling && shelfStyling.dividers) {
      setVerticalDividersEnabled(
        shelfStyling.dividers.enabled && 
        (shelfStyling.dividers.orientation === 'vertical' || shelfStyling.dividers.orientation === 'both')
      );
      setBooksPerSection(shelfStyling.dividers.booksPerSection || 4);
    }
  }, [shelfStyling]);
  
  const handleToggleDividers = (checked: boolean) => {
    // Toggle dividers with vertical orientation
    toggleDividers(checked);
    setVerticalDividersEnabled(checked);
    
    // Set the orientation to vertical or both based on current setting
    if (checked) {
      const newOrientation = shelfStyling?.dividers?.orientation === 'horizontal' ? 'both' : 'vertical';
      updateDividersSetting('orientation', newOrientation);
      
      // When enabling dividers, ensure divider color matches shelf color for cohesive look
      if (shelfStyling?.color) {
        updateDividersSetting('color', shelfStyling.color);
      }
    }
  };
  
  const handleBooksPerSectionChange = (value: number[]) => {
    const newValue = value[0];
    setBooksPerSection(newValue);
    updateDividersSetting('booksPerSection', newValue);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">Vertical Dividers</h3>
      <p className="text-xs text-muted-foreground mb-2">
        Add vertical dividers between groups of books on your shelf
      </p>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Divide className="h-4 w-4 text-gray-500" />
          <Label htmlFor="vertical-dividers">Enable vertical dividers</Label>
        </div>
        <Switch 
          id="vertical-dividers" 
          checked={verticalDividersEnabled} 
          onCheckedChange={handleToggleDividers} 
        />
      </div>
      
      {verticalDividersEnabled && (
        <div className="space-y-4 pl-6">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Books between dividers</Label>
              <span className="text-sm text-muted-foreground">{booksPerSection}</span>
            </div>
            <Slider
              value={[booksPerSection]}
              min={2}
              max={6}
              step={1}
              onValueChange={handleBooksPerSectionChange}
            />
            <p className="text-xs text-muted-foreground">
              Number of book slots between each vertical divider
            </p>
          </div>
          
          {/* Add the divider appearance sliders */}
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Divider Appearance</h4>
            <DividerAppearanceSliders />
          </div>
        </div>
      )}
    </div>
  );
};

export default VerticalDividersControl;
