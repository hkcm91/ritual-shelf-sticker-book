
import { useCallback } from 'react';
import { useBookshelfStore } from '../../store/bookshelfStore';
import { SlotType } from '@/store/types';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

interface UseSlotFileProcessingProps {
  position: number;
  slotType: SlotType;
  activeShelfId: string;
}

const useSlotFileProcessing = ({
  position,
  slotType,
  activeShelfId
}: UseSlotFileProcessingProps) => {
  const { addBook } = useBookshelfStore();
  
  // Process file helper (used when onFileSelect is not provided)
  const processFile = useCallback(async (file: File) => {
    try {
      if (!activeShelfId) {
        toast.error("No active shelf selected");
        return;
      }
      
      console.log(`[useSlotFileProcessing] Processing file: ${file.name} for slotType: ${slotType}`);
      
      // Process the file (could be image or JSON for Lottie)
      let isLottie = false;
      let fileContent = '';
      
      // For stickers, check if it's a JSON file (Lottie animation)
      if (slotType === 'sticker' && file.name.endsWith('.json')) {
        console.log(`[useSlotFileProcessing] Processing as Lottie JSON file`);
        const text = await file.text();
        try {
          // Validate it's proper JSON
          JSON.parse(text);
          fileContent = text;
          isLottie = true;
        } catch (err) {
          console.error(`[useSlotFileProcessing] Invalid JSON file:`, err);
          toast.error("Invalid JSON file");
          return;
        }
      } else {
        // For images, convert to data URL
        console.log(`[useSlotFileProcessing] Processing as image file`);
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
      
      return bookId;
    } catch (error) {
      console.error(`[useSlotFileProcessing] Error processing file:`, error);
      toast.error(`Failed to add ${slotType}. Please try again.`);
      return null;
    }
  }, [slotType, position, activeShelfId, addBook]);

  return {
    processFile
  };
};

export default useSlotFileProcessing;
