
import { useRef, useState } from 'react';
import { useBookFileHandler } from './file-handlers/useBookFileHandler';
import { useStickerFileHandler } from './file-handlers/useStickerFileHandler';
import { processFileUpload } from './file-handlers/processFileUpload';
import { toast } from 'sonner';

type UseFileHandlerProps = {
  position: number;
  slotType?: "book" | "sticker";
  maxSizeMB?: number;
};

export const useFileHandler = ({ 
  position, 
  slotType = "book", 
  maxSizeMB = 5 
}: UseFileHandlerProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  // Get handler functions from separated hooks
  const { handleBookFile } = useBookFileHandler(position);
  const { handleImageSticker, handleLottieSticker } = useStickerFileHandler(position);
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file size
    const maxSize = maxSizeMB * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error(`File is too large. Maximum size is ${maxSizeMB}MB.`);
      return;
    }
    
    console.log(`Handling file: ${file.name}, type: ${file.type}, size: ${file.size}`);
    
    try {
      // Set uploading state
      setIsUploading(true);
      
      // Process the file
      await processFileUpload(file, {
        slotType,
        handleBookFile,
        handleImageSticker,
        handleLottieSticker
      });
      
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Failed to upload file');
    } finally {
      // Clear uploading state
      setIsUploading(false);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleClick = () => {
    if (isUploading) {
      toast.info('Please wait for the current upload to complete');
      return;
    }
    fileInputRef.current?.click();
  };

  return {
    fileInputRef,
    handleFileChange,
    handleClick,
    isUploading
  };
};
