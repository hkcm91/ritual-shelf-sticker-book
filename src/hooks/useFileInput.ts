
import { useRef, useCallback, useState } from 'react';

export interface UseFileInputProps {
  onFileSelect?: (file: File) => void;
  accept?: string;
}

export const useFileInput = ({
  onFileSelect,
  accept = "image/*"
}: UseFileInputProps = {}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [lastClickTime, setLastClickTime] = useState<number>(0);
  
  // Trigger file input click with proper events handling
  const handleClick = useCallback(() => {
    console.log("[useFileInput] Triggering file input click");
    
    // Prevent double-clicks by checking timestamp (debounce)
    const now = Date.now();
    if (now - lastClickTime < 300) {
      console.log("[useFileInput] Ignoring rapid click");
      return;
    }
    setLastClickTime(now);
    
    if (fileInputRef.current) {
      // Use setTimeout to ensure the click event is processed after current event loop
      setTimeout(() => {
        console.log("[useFileInput] Actually clicking input after timeout");
        fileInputRef.current?.click();
      }, 50);
    }
  }, [lastClickTime]);
  
  // File change handler with improved error handling
  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("[useFileInput] File input change event triggered");
    const file = event.target.files?.[0];
    
    if (file && onFileSelect) {
      console.log("[useFileInput] File selected:", file.name, "type:", file.type, "size:", file.size);
      onFileSelect(file);
    } else if (!file) {
      console.log("[useFileInput] No file selected or file selection cancelled");
    }
    
    // Clear the input to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [onFileSelect]);
  
  const clearFileInput = useCallback(() => {
    console.log("[useFileInput] Clearing file input");
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
