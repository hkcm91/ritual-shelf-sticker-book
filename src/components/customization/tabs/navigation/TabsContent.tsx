
import React from 'react';
import { TabsContent as UITabsContent } from "@/components/ui/tabs";
import ThemesTab from '../ThemesTab';
import GeneralTab from '../GeneralTab';
import ContainerTab from '../ContainerTab';
import ShelvesTab from '../ShelvesTab';
import SlotsTab from '../SlotsTab';
import HeaderTab from '../HeaderTab';

const TabsContent: React.FC = () => {
  return (
    <>
      {/* Themes Tab */}
      <UITabsContent value="themes" className="space-y-6">
        <ThemesTab />
      </UITabsContent>
      
      {/* General Tab */}
      <UITabsContent value="general" className="space-y-6">
        <GeneralTab />
      </UITabsContent>
      
      {/* Container Tab */}
      <UITabsContent value="container" className="space-y-6">
        <ContainerTab />
      </UITabsContent>
      
      {/* Shelves Tab */}
      <UITabsContent value="shelves" className="space-y-6">
        <ShelvesTab />
      </UITabsContent>
      
      {/* Slots Tab */}
      <UITabsContent value="slots" className="space-y-6">
        <SlotsTab />
      </UITabsContent>
      
      {/* Header Tab */}
      <UITabsContent value="header" className="space-y-6">
        <HeaderTab />
      </UITabsContent>
    </>
  );
};

export default TabsContent;
