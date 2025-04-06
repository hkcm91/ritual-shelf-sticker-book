
import { useRef } from 'react';
import { useBookshelfStore } from '../store/bookshelfStore';
import { toast } from 'sonner';

type UseFileHandlerProps = {
  position: number;
  slotType?: "book" | "sticker";
};

export const useFileHandler = ({ position, slotType = "book" }: UseFileHandlerProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { activeShelfId, addBook, openModal } = useBookshelfStore();
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (typeof event.target?.result === 'string') {
          try {
            const newBookId = addBook({
              title: slotType === "book" ? '' : file.name.replace(/\.[^/.]+$/, ""),
              author: slotType === "book" ? '' : 'Sticker',
              coverURL: event.target.result,
              progress: 0,
              rating: 0,
              position,
              shelfId: activeShelfId,
              isSticker: slotType === "sticker"
            });
            
            if (newBookId && slotType === "book") {
              // Important: Open modal for book editing
              openModal(newBookId);
            } else if (newBookId) {
              toast.success('Sticker added successfully');
            } else {
              toast.error('Failed to add item');
            }
          } catch (error) {
            console.error('Error adding item:', error);
            toast.error('Failed to save to localStorage. Try using smaller images or clearing some space.');
          }
        }
      };
      reader.readAsDataURL(file);
    } else if (file.type === 'application/json') {
      // Handle Lottie JSON files
      const reader = new FileReader();
      reader.onload = (event) => {
        if (typeof event.target?.result === 'string') {
          try {
            // Check if it's a valid Lottie JSON
            const lottieData = JSON.parse(event.target.result);
            if (lottieData && (lottieData.v !== undefined || lottieData.animations)) {
              try {
                const newBookId = addBook({
                  title: file.name.replace('.json', ''),
                  author: 'Lottie Animation',
                  coverURL: event.target.result,
                  progress: 0,
                  rating: 0,
                  position,
                  shelfId: activeShelfId,
                  isSticker: true
                });
                
                if (newBookId) {
                  toast.success('Lottie animation added successfully');
                } else {
                  toast.error('Failed to add animation');
                }
              } catch (error) {
                console.error('Error adding Lottie:', error);
                toast.error('Failed to save to localStorage. Try using smaller animations or clearing some space.');
              }
            } else {
              toast.error('Invalid Lottie animation format');
            }
          } catch (e) {
            console.error('Failed to parse JSON:', e);
            toast.error('Failed to parse JSON file');
          }
        }
      };
      reader.readAsText(file);
    } else {
      toast.error('Unsupported file type. Please use images or Lottie JSON files.');
    }
    
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
