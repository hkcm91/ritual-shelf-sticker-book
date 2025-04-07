
import React, { useState } from 'react';
import {
  Sheet,
  SheetTrigger,
} from "@/components/ui/sheet";
import SettingsDrawerTrigger from './SettingsDrawerTrigger';
import SettingsDrawerContent from './SettingsDrawerContent';

const SettingsDrawer: React.FC = () => {
  const [open, setOpen] = useState(false);
  
  const handleOpenChange = (newOpen: boolean) => {
    console.log("Settings drawer onOpenChange triggered, new state:", newOpen);
    setOpen(newOpen);
  };

  console.log("SettingsDrawer rendered, open state:", open);
  
  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <SettingsDrawerTrigger onClick={() => setOpen(true)} />
      </SheetTrigger>
      <SettingsDrawerContent onCloseDrawer={() => setOpen(false)} />
    </Sheet>
  );
};

export default SettingsDrawer;
