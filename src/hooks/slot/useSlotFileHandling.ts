
import { useCallback } from 'react';
import useFileInput from '../useFileInput';

interface UseSlotFileHandlingProps {
  onFileSelect?: (file: File) => void;
}

const useSlotFileHandling = ({ onFileSelect }: UseSlotFileHandlingProps) => {
  // Set up file input handling with safeguards
  const { fileInputRef, handleClick: fileInputTrigger, handleFileChange: fileInputChange, clearFileInput } = useFileInput({
    onFileSelect
  });
  
  // Safely trigger file input with extra logging
  const triggerFileInput = useCallback(() => {
    console.log("[useSlotFileHandling] Triggering file input click");
    fileInputTrigger();
  }, [fileInputTrigger]);
  
  // Handle the file change event with additional safeguards
  const handleFileChange = useCallback((file: File) => {
    console.log("[useSlotFileHandling] File selected:", file.name);
    
    if (onFileSelect) {
      try {
        onFileSelect(file);
      } catch (error) {
        console.error("[useSlotFileHandling] Error handling file:", error);
      }
    }
    
    // Clear the input to allow selecting the same file again
    clearFileInput();
  }, [onFileSelect, clearFileInput]);
  
  return {
    fileInputRef,
    handleFileChange,
    triggerFileInput,
    clearFileInput
  };
};

export default useSlotFileHandling;
