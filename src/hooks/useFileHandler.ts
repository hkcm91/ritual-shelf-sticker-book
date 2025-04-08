
import { useRef, useCallback } from 'react';
import { useBookshelfStore } from '../store/bookshelfStore';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { SlotType } from '../store/types';

interface UseFileHandlerProps {
  position: number;
  slotType: SlotType;
  onFileSelect?: (file: File) => void;
}

export const useFileHandler = ({
  position,
  slotType,
  onFileSelect
}: UseFileHandlerProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addBook, activeShelfId } = useBookshelfStore();
  
  // Handle clicking on empty slot to trigger file input
  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, [fileInputRef]);

  // Handle file change to add book/sticker
  const handleFileChange = useCallback(
    async (file: File) => {
      try {
        if (!activeShelfId) {
          toast.error("No active shelf selected");
          return;
        }
        
        // If external handler provided, use it
        if (onFileSelect) {
          onFileSelect(file);
          return;
        }

        // Process the file (could be image or JSON for Lottie)
        let isLottie = false;
        let fileContent = '';
        
        // For stickers, check if it's a JSON file (Lottie animation)
        if (slotType === 'sticker' && file.name.endsWith('.json')) {
          const text = await file.text();
          try {
            // Validate it's proper JSON
            JSON.parse(text);
            fileContent = text;
            isLottie = true;
          } catch (err) {
            toast.error("Invalid JSON file");
            return;
          }
        } else {
          // For images, convert to data URL
          fileContent = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(file);
          });
        }

        // Generate a book ID
        const bookId = uuidv4();
        
        // Create book title from filename
        const fileName = file.name.split('.')[0];
        const title = fileName.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

        // Add the book to the store
        const bookData = {
          id: bookId,
          title,
          author: slotType === 'sticker' ? 'Sticker' : 'Unknown Author',
          position,
          coverURL: fileContent,
          shelfId: activeShelfId,
          isSticker: slotType === 'sticker',
        };
        
        if (slotType === 'sticker') {
          // Initialize sticker properties
          Object.assign(bookData, {
            position2D: { x: 0, y: 0 },
            scale: 1,
            rotation: 0,
            zIndex: 10
          });
        }
        
        addBook(bookData);
        toast.success(`${slotType === 'sticker' ? 'Sticker' : 'Book'} added successfully!`);
      } catch (error) {
        console.error("Error adding book:", error);
        toast.error(`Failed to add ${slotType}. Please try again.`);
      }
    },
    [addBook, activeShelfId, position, slotType, onFileSelect]
  );
  
  return {
    fileInputRef,
    handleFileChange,
    handleClick
  };
};

export default useFileHandler;
