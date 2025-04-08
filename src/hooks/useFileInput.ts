
import { useRef, useCallback } from 'react';

export interface UseFileInputProps {
  onFileSelect?: (file: File) => void;
}

export const useFileInput = ({
  onFileSelect
}: UseFileInputProps = {}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);
  
  const clearFileInput = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);
  
  return {
    fileInputRef,
    handleClick,
    clearFileInput,
    onFileSelect
  };
};

export default useFileInput;
