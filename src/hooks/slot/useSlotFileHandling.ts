
import { useCallback } from 'react';
import useFileInput from '../useFileInput';

interface UseSlotFileHandlingProps {
  onFileSelect?: (file: File) => void;
}

const useSlotFileHandling = ({ onFileSelect }: UseSlotFileHandlingProps) => {
  // Set up file input handling
  const { fileInputRef, handleClick: triggerFileInput } = useFileInput({
    onFileSelect
  });
  
  // Optional file change handler
  const handleFileChange = useCallback((file: File) => {
    if (onFileSelect) {
      onFileSelect(file);
    }
  }, [onFileSelect]);
  
  return {
    fileInputRef,
    handleFileChange,
    triggerFileInput
  };
};

export default useSlotFileHandling;
