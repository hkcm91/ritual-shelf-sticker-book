
import React from 'react';
import { Tabs } from "@/components/ui/tabs";
import TabsList from './tabs/navigation/TabsList';
import TabsContent from './tabs/navigation/TabsContent';
import ActionButtons from './ActionButtons';

const CustomizationContent: React.FC = () => {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="shelves" className="w-full">
        <TabsList />
        <TabsContent />
      </Tabs>
      
      <ActionButtons />
    </div>
  );
};

export default CustomizationContent;
