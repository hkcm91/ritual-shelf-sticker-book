
import { useRef } from 'react';
import { useBookFileHandler } from './file-handlers/useBookFileHandler';
import { useStickerFileHandler } from './file-handlers/useStickerFileHandler';
import { processFileUpload } from './file-handlers/processFileUpload';

type UseFileHandlerProps = {
  position: number;
  slotType?: "book" | "sticker";
};

export const useFileHandler = ({ position, slotType = "book" }: UseFileHandlerProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Get handler functions from separated hooks
  const { handleBookFile } = useBookFileHandler(position);
  const { handleImageSticker, handleLottieSticker } = useStickerFileHandler(position);
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    console.log(`Handling file: ${file.name}, type: ${file.type}, size: ${file.size}`);
    
    await processFileUpload(file, {
      slotType,
      handleBookFile,
      handleImageSticker,
      handleLottieSticker
    });
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return {
    fileInputRef,
    handleFileChange,
    handleClick
  };
};
