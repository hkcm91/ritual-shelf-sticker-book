
import React from 'react';
import { Tabs } from "@/components/ui/tabs";
import TabsList from './tabs/navigation/TabsList';
import TabsContent from './tabs/navigation/TabsContent';
import ActionButtons from './ActionButtons';
import ErrorBoundary from '@/components/ErrorBoundary';
import { useBookshelfStore } from '@/store/bookshelfStore';

const CustomizationContent: React.FC = () => {
  const { loadCustomization } = useBookshelfStore();
  
  // Function to handle error boundary reset
  const handleErrorReset = () => {
    // Reload customization when recovering from error
    try {
      loadCustomization();
    } catch (error) {
      console.error('Failed to reload customization:', error);
    }
  };
  
  return (
    <div className="space-y-6">
      <ErrorBoundary 
        componentName="CustomizationTabs"
        onReset={handleErrorReset}
      >
        <Tabs defaultValue="shelves" className="w-full">
          <TabsList />
          <TabsContent />
        </Tabs>
      </ErrorBoundary>
      
      <ActionButtons />
    </div>
  );
};

export default CustomizationContent;
