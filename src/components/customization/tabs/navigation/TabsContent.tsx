
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
      <UITabsContent value="themes" className="pb-6 mt-4">
        <ThemesTab />
      </UITabsContent>
      
      {/* General Tab */}
      <UITabsContent value="general" className="pb-6 mt-4">
        <GeneralTab />
      </UITabsContent>
      
      {/* Container Tab */}
      <UITabsContent value="container" className="pb-6 mt-4">
        <ContainerTab />
      </UITabsContent>
      
      {/* Shelves Tab */}
      <UITabsContent value="shelves" className="pb-6 mt-4">
        <ShelvesTab />
      </UITabsContent>
      
      {/* Slots Tab */}
      <UITabsContent value="slots" className="pb-6 mt-4">
        <SlotsTab />
      </UITabsContent>
      
      {/* Header Tab */}
      <UITabsContent value="header" className="pb-6 mt-4">
        <HeaderTab />
      </UITabsContent>
    </>
  );
};

export default TabsContent;
