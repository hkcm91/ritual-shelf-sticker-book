
import { useCallback } from 'react';
import useFileInput from '../useFileInput';

interface UseSlotFileHandlingProps {
  onFileSelect?: (file: File) => void;
}

const useSlotFileHandling = ({ onFileSelect }: UseSlotFileHandlingProps) => {
  // Set up file input handling
  const { fileInputRef, handleClick: triggerFileInput, clearFileInput } = useFileInput({
    onFileSelect
  });
  
  // Handle the file change event
  const handleFileChange = useCallback((file: File) => {
    console.log("[useSlotFileHandling] File selected:", file.name);
    
    if (onFileSelect) {
      onFileSelect(file);
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
