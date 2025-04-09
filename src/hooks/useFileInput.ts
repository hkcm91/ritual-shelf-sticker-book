
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
      // Use setTimeout to avoid issues with event propagation
      setTimeout(() => {
        fileInputRef.current?.click();
      }, 0);
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
