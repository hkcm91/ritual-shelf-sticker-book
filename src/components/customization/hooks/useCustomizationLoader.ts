
import { useState, useEffect } from 'react';
import { useBookshelfStore } from '@/store/bookshelfStore';
import { toast } from 'sonner';

export const useCustomizationLoader = () => {
  const { loadCustomization } = useBookshelfStore();
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  
  // Load customization when hook is initialized
  useEffect(() => {
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
    // Important: Empty dependency array to prevent infinite calls
  }, []);
  
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
  
  return {
    isLoading,
    hasError,
    handleErrorReset
  };
};

export default useCustomizationLoader;
