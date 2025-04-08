
import React from 'react';
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
    <>
      {/* If we're NOT on the library page, we need to create the tabs structure */}
      <Tabs defaultValue="layout" className="mt-6">
        <TabsList className="grid w-full grid-cols-3 bg-amber-950/50 border border-amber-700/30">
          <TabsTrigger 
            value="layout" 
            className="flex items-center gap-1 data-[state=active]:bg-amber-900/50 data-[state=active]:text-amber-100"
          >
            <Layout className="h-3.5 w-3.5" />
            <span>Layout</span>
          </TabsTrigger>
          <TabsTrigger 
            value="appearance" 
            className="flex items-center gap-1 data-[state=active]:bg-amber-900/50 data-[state=active]:text-amber-100"
          >
            <Palette className="h-3.5 w-3.5" />
            <span>Theme</span>
          </TabsTrigger>
          <TabsTrigger 
            value="storage" 
            className="flex items-center gap-1 data-[state=active]:bg-amber-900/50 data-[state=active]:text-amber-100"
          >
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
      
      {/* If we ARE on the library page, these tabs are rendered elsewhere so we just fill in the content */}
      <TabsContent value="layout" className="mt-4 space-y-6">
        <LayoutTab />
      </TabsContent>
      
      <TabsContent value="appearance" className="mt-4 space-y-6">
        <AppearanceTab onCloseDrawer={onCloseDrawer} />
      </TabsContent>
      
      <TabsContent value="storage" className="mt-4">
        <StorageSettings />
      </TabsContent>
    </>
  );
};

export default SettingsDrawerContent;
