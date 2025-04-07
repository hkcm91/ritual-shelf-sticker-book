
import { useBookshelfStore } from '../../store/bookshelfStore';
import { toast } from 'sonner';
import { compressImage } from '../../utils/imageUtils';

export const useStickerFileHandler = (position: number) => {
  const { activeShelfId, addBook } = useBookshelfStore();

  const handleImageSticker = async (file: File): Promise<string | undefined> => {
    console.log(`Handling sticker image: ${file.name}, type: ${file.type}, size: ${file.size}`);
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (event) => {
        if (typeof event.target?.result === 'string') {
          try {
            let imageData = event.target.result;
            
            // Try to compress sticker images for better storage efficiency
            if (file.size > 100 * 1024) { // If over 100KB
              try {
                imageData = await compressImage(imageData, {
                  quality: 0.6,
                  maxWidth: 400,
                  maxHeight: 400
                });
                console.log("Sticker image compressed successfully");
              } catch (err) {
                console.warn('Failed to compress sticker image:', err);
                // Continue with original image if compression fails
              }
            }
            
            const newBookId = addBook({
              title: file.name.replace(/\.[^/.]+$/, ""),
              author: 'Sticker',
              coverURL: imageData,
              progress: 0,
              rating: 0,
              position,
              shelfId: activeShelfId,
              isSticker: true
            });
            
            if (newBookId) {
              toast.success('Sticker added successfully');
              resolve(newBookId);
            } else {
              toast.error('Failed to add sticker');
              reject('Failed to add sticker');
            }
          } catch (error) {
            console.error('Error adding sticker:', error);
            toast.error('Failed to save to localStorage. Try using smaller images or clearing some space.');
            reject(error);
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleLottieSticker = async (file: File): Promise<string | undefined> => {
    console.log(`Handling Lottie sticker: ${file.name}, type: ${file.type}, size: ${file.size}`);
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          if (typeof event.target?.result === 'string') {
            const jsonContent = event.target.result;
            
            // Check if it's valid JSON and a Lottie file
            try {
              const lottieData = JSON.parse(jsonContent);
              if (lottieData && (lottieData.v !== undefined || lottieData.animations)) {
                const newBookId = addBook({
                  title: file.name.replace('.json', ''),
                  author: 'Lottie Animation',
                  coverURL: jsonContent,
                  progress: 0,
                  rating: 0,
                  position,
                  shelfId: activeShelfId,
                  isSticker: true
                });
                
                if (newBookId) {
                  toast.success('Lottie animation added successfully');
                  resolve(newBookId);
                } else {
                  toast.error('Failed to add animation');
                  reject('Failed to add animation');
                }
              } else {
                toast.error('Invalid Lottie animation format');
                reject('Invalid Lottie animation format');
              }
            } catch (e) {
              console.error('Failed to parse JSON:', e);
              toast.error('Failed to parse JSON file');
              reject('Failed to parse JSON file');
            }
          }
        } catch (err) {
          console.error('Error processing Lottie file:', err);
          toast.error('Error processing Lottie file');
          reject(err);
        }
      };
      reader.readAsText(file);
    });
  };

  return {
    handleImageSticker,
    handleLottieSticker
  };
};
