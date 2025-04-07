
import { useRef } from 'react';
import { useBookshelfStore } from '../../store/bookshelfStore';
import { toast } from 'sonner';
import { compressImage } from '../../utils/imageUtils';

export const useBookFileHandler = (position: number) => {
  const { activeShelfId, addBook, openModal } = useBookshelfStore();

  const handleBookFile = async (file: File): Promise<string | undefined> => {
    if (!file.type.startsWith('image/')) {
      toast.error('Only image files are supported for books');
      return;
    }
    
    console.log(`Handling book file: ${file.name}, type: ${file.type}, size: ${file.size}`);

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (event) => {
        if (typeof event.target?.result === 'string') {
          try {
            // Compress the image before adding
            let imageData = event.target.result;
            console.log('FileReader Result (Data URL):', imageData ? `${imageData.substring(0, 100)}... (length: ${imageData.length})` : 'null/undefined');
            
            // Only compress if over 200KB
            if (file.size > 200 * 1024) {
              try {
                imageData = await compressImage(imageData, {
                  quality: 0.7,
                  maxWidth: 600,
                  maxHeight: 900
                });
                console.log("Book cover compressed successfully");
                console.log('Compressed Data URL:', imageData ? `${imageData.substring(0, 100)}... (length: ${imageData.length})` : 'null/undefined');
              } catch (err) {
                console.warn('Failed to compress book cover:', err);
                // Continue with original image
              }
            }
            
            // Log the book data we're about to send to the store
            const bookDataForStore = {
              title: '',
              author: '',
              coverURL: imageData,
              progress: 0,
              rating: 0,
              position,
              shelfId: activeShelfId,
              isSticker: false
            };
            
            console.log('Data being sent to Zustand for Manual Upload:', {
              ...bookDataForStore,
              coverURL: bookDataForStore.coverURL ? `${bookDataForStore.coverURL.substring(0, 100)}... (length: ${bookDataForStore.coverURL.length})` : 'missing'
            });
            
            const newBookId = addBook(bookDataForStore);
            
            // Now let's log what was returned
            console.log('After addBook call, newBookId:', newBookId);
            
            if (newBookId) {
              // Open modal for book editing
              openModal(newBookId);
              resolve(newBookId);
            } else {
              toast.error('Failed to add book');
              reject('Failed to add book');
            }
          } catch (error) {
            console.error('Error adding book:', error);
            toast.error('Failed to save to localStorage. Try using smaller images or clearing some space.');
            reject(error);
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  return { handleBookFile };
};
