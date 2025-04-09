
import { useRef, useCallback } from 'react';

export interface UseFileInputProps {
  onFileSelect?: (file: File) => void;
  accept?: string;
}

export const useFileInput = ({
  onFileSelect,
  accept = "image/*"
}: UseFileInputProps = {}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Explicitly trigger the file input click
  const handleClick = useCallback(() => {
    console.log("[useFileInput] Triggering file input click");
    
    if (fileInputRef.current) {
      // Use a try/catch block to handle security errors that might occur
      try {
        // Use setTimeout to avoid issues with event propagation
        setTimeout(() => {
          if (fileInputRef.current) {
            // Ensure the input is not disabled
            fileInputRef.current.disabled = false;
            fileInputRef.current.click();
          }
        }, 0);
      } catch (error) {
        console.error("[useFileInput] Error triggering file input:", error);
      }
    }
  }, []);
  
  // Handle file change event from input
  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    console.log("[useFileInput] File selected:", file?.name);
    
    if (file && onFileSelect) {
      onFileSelect(file);
    }
    
    // Clear the input to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [onFileSelect]);
  
  // Clear the file input
  const clearFileInput = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);
  
  return {
    fileInputRef,
    handleClick,
    handleFileChange,
    clearFileInput,
    onFileSelect,
    accept
  };
};

export default useFileInput;
