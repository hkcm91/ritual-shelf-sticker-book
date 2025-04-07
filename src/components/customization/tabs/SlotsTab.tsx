
import React from 'react';
import { Label } from "@/components/ui/label";
import { useBookshelfStore } from "@/store/bookshelfStore";
import ColorPicker from '../ColorPicker';

const SlotsTab: React.FC = () => {
  const { slots, updateSlotSetting } = useBookshelfStore();

  return (
    <>
      <div className="rounded-md border p-4 space-y-4">
        <h3 className="font-medium text-lg">Empty Slot Add Button</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Button Background</Label>
            <ColorPicker 
              color={slots.addButtonBg} 
              onChange={(color) => updateSlotSetting('addButtonBg', color)} 
              allowAlpha
            />
          </div>
          
          <div className="space-y-2">
            <Label>Button Icon Color</Label>
            <ColorPicker 
              color={slots.addButtonColor} 
              onChange={(color) => updateSlotSetting('addButtonColor', color)} 
            />
          </div>
          
          <div className="space-y-2">
            <Label>Button Hover Background</Label>
            <ColorPicker 
              color={slots.addButtonHoverBg} 
              onChange={(color) => updateSlotSetting('addButtonHoverBg', color)} 
            />
          </div>
          
          <div className="space-y-2">
            <Label>Empty Slot Hover Background</Label>
            <ColorPicker 
              color={slots.emptyHoverBg} 
              onChange={(color) => updateSlotSetting('emptyHoverBg', color)} 
              allowAlpha
            />
          </div>
        </div>
      </div>
      
      <div className="rounded-md border p-4 space-y-4">
        <h3 className="font-medium text-lg">Slot Type Toggle Dots</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Inactive Dot Color</Label>
            <ColorPicker 
              color={slots.toggleInactiveColor} 
              onChange={(color) => updateSlotSetting('toggleInactiveColor', color)} 
              allowAlpha
            />
          </div>
          
          <div className="space-y-2">
            <Label>Active Dot Color</Label>
            <ColorPicker 
              color={slots.toggleActiveColor} 
              onChange={(color) => updateSlotSetting('toggleActiveColor', color)} 
              allowAlpha
            />
          </div>
          
          <div className="space-y-2">
            <Label>Dot Border Color</Label>
            <ColorPicker 
              color={slots.toggleBorderColor} 
              onChange={(color) => updateSlotSetting('toggleBorderColor', color)} 
              allowAlpha
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default SlotsTab;
