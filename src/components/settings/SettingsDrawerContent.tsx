
import React from 'react';
import {
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Layout, 
  Palette,
  Save,
} from 'lucide-react';
import LayoutTab from './tabs/LayoutTab';
import AppearanceTab from './tabs/AppearanceTab';
import StorageSettings from '@/components/StorageSettings';

interface SettingsDrawerContentProps {
  onCloseDrawer: () => void;
}

const SettingsDrawerContent: React.FC<SettingsDrawerContentProps> = ({ onCloseDrawer }) => {
  return (
    <SheetContent className="overflow-y-auto">
      <SheetHeader>
        <SheetTitle>Bookshelf Settings</SheetTitle>
        <SheetDescription>
          Adjust your bookshelf layout and storage
        </SheetDescription>
      </SheetHeader>
      
      <Tabs defaultValue="layout" className="mt-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="layout" className="flex items-center gap-1">
            <Layout className="h-3.5 w-3.5" />
            <span>Layout</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-1">
            <Palette className="h-3.5 w-3.5" />
            <span>Theme</span>
          </TabsTrigger>
          <TabsTrigger value="storage" className="flex items-center gap-1">
            <Save className="h-3.5 w-3.5" />
            <span>Storage</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="layout" className="mt-4 space-y-6">
          <LayoutTab />
        </TabsContent>
        
        <TabsContent value="appearance" className="mt-4 space-y-6">
          <AppearanceTab onCloseDrawer={onCloseDrawer} />
        </TabsContent>
        
        <TabsContent value="storage" className="mt-4">
          <StorageSettings />
        </TabsContent>
      </Tabs>
    </SheetContent>
  );
};

export default SettingsDrawerContent;
