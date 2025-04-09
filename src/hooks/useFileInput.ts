
import { useRef, useCallback } from 'react';
import { toast } from 'sonner';

export interface UseFileInputProps {
  onFileSelect?: (file: File) => void;
  accept?: string;
}

export const useFileInput = ({
  onFileSelect,
  accept = "image/*"
}: UseFileInputProps = {}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleClick = useCallback(() => {
    console.log("[useFileInput] Triggering file input click");
    if (fileInputRef.current) {
      // Use a small timeout to avoid event propagation issues
      setTimeout(() => {
        fileInputRef.current?.click();
      }, 50);
    }
  }, []);
  
  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (file && onFileSelect) {
      console.log("[useFileInput] File selected:", file.name);
      onFileSelect(file);
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
