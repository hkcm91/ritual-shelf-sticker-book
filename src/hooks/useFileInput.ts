
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
  
  // Trigger file input click with proper events handling
  const handleClick = useCallback(() => {
    console.log("[useFileInput] Triggering file input click");
    if (fileInputRef.current) {
      // Use setTimeout to ensure the click event is processed after current event loop
      setTimeout(() => {
        fileInputRef.current?.click();
      }, 0);
    }
  }, []);
  
  // File change handler with improved error handling
  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (file && onFileSelect) {
      console.log("[useFileInput] File selected:", file.name);
      onFileSelect(file);
    } else if (!file) {
      console.log("[useFileInput] No file selected");
    }
    
    // Clear the input to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [onFileSelect]);
  
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
    accept
  };
};

export default useFileInput;
