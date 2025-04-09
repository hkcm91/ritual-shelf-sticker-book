
import { useCallback } from 'react';
import useFileInput from '../useFileInput';
import { toast } from 'sonner';

interface UseSlotFileHandlingProps {
  onFileSelect?: (file: File) => void;
}

const useSlotFileHandling = ({ onFileSelect }: UseSlotFileHandlingProps) => {
  const { fileInputRef, handleClick, handleFileChange: fileInputChange } = useFileInput({
    onFileSelect: (file) => {
      console.log("[useSlotFileHandling] File selected:", file.name);
      if (onFileSelect) {
        onFileSelect(file);
        toast.success(`File "${file.name}" selected`);
      }
    }
  });
  
  const triggerFileInput = useCallback(() => {
    console.log("[useSlotFileHandling] Triggering file input");
    handleClick();
  }, [handleClick]);
  
  const handleFileChange = useCallback((file: File) => {
    console.log("[useSlotFileHandling] File change handler called with file:", file.name);
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
