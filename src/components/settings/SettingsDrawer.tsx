
import React, { useState } from 'react';
import {
  Sheet,
  SheetTrigger,
} from "@/components/ui/sheet";
import SettingsDrawerTrigger from './SettingsDrawerTrigger';
import SettingsDrawerContent from './SettingsDrawerContent';

const SettingsDrawer: React.FC = () => {
  const [open, setOpen] = useState(false);
  
  // Improved handling with event logging
  const handleOpenChange = (newOpen: boolean) => {
    console.log("Settings drawer onOpenChange triggered, new state:", newOpen);
    setOpen(newOpen);
  };

  // Separate handler for the trigger button click
  const handleTriggerClick = () => {
    console.log("Settings drawer trigger clicked, setting state to:", !open);
    setOpen(true);
  };

  console.log("SettingsDrawer rendered, open state:", open);
  
  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <SettingsDrawerTrigger onClick={handleTriggerClick} />
      </SheetTrigger>
      <SettingsDrawerContent onCloseDrawer={() => setOpen(false)} />
    </Sheet>
  );
};

export default SettingsDrawer;
