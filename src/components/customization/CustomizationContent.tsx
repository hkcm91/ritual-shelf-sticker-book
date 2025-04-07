
import React from 'react';
import { Tabs } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import TabsList from './tabs/navigation/TabsList';
import TabsContent from './tabs/navigation/TabsContent';
import ActionButtons from './ActionButtons';
import ErrorBoundary from '@/components/ErrorBoundary';
import CustomizationLoader from './layout/CustomizationLoader';
import useCustomizationLoader from './hooks/useCustomizationLoader';

const CustomizationContent: React.FC = () => {
  // Use the custom hook for loading state management
  const { isLoading, hasError, handleErrorReset } = useCustomizationLoader();
  
  if (isLoading) {
    return <CustomizationLoader />;
  }
  
  return (
    <div className="flex flex-col h-full">
      <ErrorBoundary 
        componentName="CustomizationTabs"
        onReset={handleErrorReset}
      >
        <Tabs defaultValue="themes" className="w-full flex-1 flex flex-col">
          <TabsList />
          <ScrollArea className="flex-1 pr-1">
            <TabsContent />
          </ScrollArea>
        </Tabs>
      </ErrorBoundary>
      
      <ActionButtons className="mt-4" />
    </div>
  );
};

export default CustomizationContent;
