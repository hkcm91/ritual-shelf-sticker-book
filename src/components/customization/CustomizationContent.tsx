
import React, { useState, useEffect } from 'react';
import { Tabs } from "@/components/ui/tabs";
import TabsList from './tabs/navigation/TabsList';
import TabsContent from './tabs/navigation/TabsContent';
import ActionButtons from './ActionButtons';
import ErrorBoundary from '@/components/ErrorBoundary';
import { useBookshelfStore } from '@/store/bookshelfStore';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const CustomizationContent: React.FC = () => {
  const { loadCustomization } = useBookshelfStore();
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  
  useEffect(() => {
    // Load customization when component mounts
    const loadSettings = async () => {
      try {
        setIsLoading(true);
        await loadCustomization();
        setHasError(false);
      } catch (error) {
        console.error('Failed to load customization:', error);
        toast.error('Could not load customization settings');
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSettings();
  }, [loadCustomization]);
  
  // Function to handle error boundary reset
  const handleErrorReset = () => {
    // Reload customization when recovering from error
    setIsLoading(true);
    try {
      loadCustomization();
      setHasError(false);
      toast.success('Settings reloaded successfully');
    } catch (error) {
      console.error('Failed to reload customization:', error);
      toast.error('Failed to reload customization settings');
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">Loading customization settings...</span>
      </div>
    );
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
