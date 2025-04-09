
import { useCallback } from 'react';
import useFileInput from '../useFileInput';
import { toast } from 'sonner';
import { SlotType } from '@/store/types';

interface UseSlotFileHandlingProps {
  onFileSelect?: (file: File) => void;
  slotType?: SlotType;
}

const useSlotFileHandling = ({ 
  onFileSelect,
  slotType = 'book'
}: UseSlotFileHandlingProps) => {
  // Configure accept types based on slot type
  const acceptType = slotType === 'sticker' ? "image/*, .json" : "image/*";
  
  const { fileInputRef, handleClick, handleFileChange: fileInputChange } = useFileInput({
    onFileSelect: (file) => {
      console.log(`[useSlotFileHandling] File selected for ${slotType}:`, file.name);
      if (onFileSelect) {
        onFileSelect(file);
        toast.success(`File "${file.name}" selected`);
      }
    },
    accept: acceptType
  });
  
  const triggerFileInput = useCallback(() => {
    console.log(`[useSlotFileHandling] Triggering file input for ${slotType}`);
    handleClick();
  }, [handleClick, slotType]);
  
  const handleFileChange = useCallback((file: File) => {
    console.log(`[useSlotFileHandling] File change handler called for ${slotType} with file:`, file.name);
    if (onFileSelect) {
      onFileSelect(file);
    }
  }, [onFileSelect, slotType]);
  
  return {
    fileInputRef,
    handleFileChange,
    triggerFileInput,
    acceptType
  };
};

export default useSlotFileHandling;
