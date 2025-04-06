
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
    
    // For book type, only allow images
    if (slotType === "book") {
      if (!file.type.startsWith('image/')) {
        toast.error('Only image files are supported for books');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        if (typeof event.target?.result === 'string') {
          try {
            const newBookId = addBook({
              title: '',
              author: '',
              coverURL: event.target.result,
              progress: 0,
              rating: 0,
              position,
              shelfId: activeShelfId,
              isSticker: false
            });
            
            if (newBookId) {
              // Open modal for book editing
              openModal(newBookId);
            } else {
              toast.error('Failed to add book');
            }
          } catch (error) {
            console.error('Error adding book:', error);
            toast.error('Failed to save to localStorage. Try using smaller images or clearing some space.');
          }
        }
      };
      reader.readAsDataURL(file);
    } 
    // For sticker type, allow images and Lottie JSON
    else if (slotType === "sticker") {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (typeof event.target?.result === 'string') {
            try {
              const newBookId = addBook({
                title: file.name.replace(/\.[^/.]+$/, ""),
                author: 'Sticker',
                coverURL: event.target.result,
                progress: 0,
                rating: 0,
                position,
                shelfId: activeShelfId,
                isSticker: true
              });
              
              if (newBookId) {
                toast.success('Sticker added successfully');
              } else {
                toast.error('Failed to add sticker');
              }
            } catch (error) {
              console.error('Error adding sticker:', error);
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
