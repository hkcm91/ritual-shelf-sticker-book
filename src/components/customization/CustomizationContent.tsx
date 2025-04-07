
import React from 'react';
import { Tabs } from "@/components/ui/tabs";
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
    <div className="space-y-6">
      <ErrorBoundary 
        componentName="CustomizationTabs"
        onReset={handleErrorReset}
      >
        <Tabs defaultValue="themes" className="w-full">
          <TabsList />
          <TabsContent />
        </Tabs>
      </ErrorBoundary>
      
      <ActionButtons />
    </div>
  );
};

export default CustomizationContent;
