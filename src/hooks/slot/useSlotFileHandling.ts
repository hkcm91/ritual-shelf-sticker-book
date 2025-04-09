
import { useCallback, useEffect } from 'react';
import useFileInput from '../useFileInput';
import { toast } from 'sonner';
import { SlotType } from '@/store/types';

interface UseSlotFileHandlingProps {
  onFileSelect?: (file: File) => void;
  slotType?: SlotType;
  position?: number;
}

const useSlotFileHandling = ({ 
  onFileSelect,
  slotType = 'book',
  position = -1
}: UseSlotFileHandlingProps) => {
  // Set accept type based on slot type
  const acceptType = "image/*";
  
  const { fileInputRef, handleClick, handleFileChange: fileInputChange, clearFileInput } = useFileInput({
    onFileSelect: (file) => {
      console.log(`[useSlotFileHandling] File selected for ${slotType} at position ${position}:`, file.name, "type:", file.type);
      
      // Validate file type
      const isImage = file.type.startsWith('image/');
      
      if (!isImage) {
        toast.error(`Only image files are allowed for ${slotType}s`);
        return;
      }
      
      if (onFileSelect) {
        onFileSelect(file);
        toast.success(`File "${file.name}" selected for ${slotType}`);
      }
    },
    accept: acceptType
  });
  
  // Clean up file input when component unmounts
  useEffect(() => {
    return () => {
      clearFileInput();
    };
  }, [clearFileInput]);
  
  const triggerFileInput = useCallback(() => {
    console.log(`[useSlotFileHandling] Triggering file input for ${slotType} at position ${position}`);
    handleClick();
  }, [handleClick, slotType, position]);
  
  const handleFileChange = useCallback((file: File) => {
    console.log(`[useSlotFileHandling] File change handler called for ${slotType} at position ${position} with file:`, file.name);
    if (onFileSelect) {
      onFileSelect(file);
    }
  }, [onFileSelect, slotType, position]);
  
  return {
    fileInputRef,
    handleFileChange,
    triggerFileInput,
    acceptType
  };
};

export default useSlotFileHandling;
