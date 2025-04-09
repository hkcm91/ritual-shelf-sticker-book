
import { useCallback } from 'react';
import useFileInput from '../useFileInput';
import { toast } from 'sonner';

interface UseSlotFileHandlingProps {
  onFileSelect?: (file: File) => void;
}

const useSlotFileHandling = ({ onFileSelect }: UseSlotFileHandlingProps) => {
  const { fileInputRef, handleClick, handleFileChange: fileInputChange, clearFileInput } = useFileInput({
    onFileSelect: (file) => {
      console.log("[useSlotFileHandling] File selected:", file.name);
      if (onFileSelect) {
        onFileSelect(file);
      }
      clearFileInput();
    }
  });
  
  const triggerFileInput = useCallback(() => {
    console.log("[useSlotFileHandling] Triggering file input");
    handleClick();
  }, [handleClick]);
  
  const handleFileChange = useCallback((file: File) => {
    console.log("[useSlotFileHandling] File change handler called");
    if (onFileSelect) {
      onFileSelect(file);
      toast.success(`File "${file.name}" selected`);
    }
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
