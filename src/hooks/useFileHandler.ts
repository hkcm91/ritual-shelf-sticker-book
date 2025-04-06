
import { useRef } from 'react';
import { useBookshelfStore } from '../store/bookshelfStore';
import { toast } from 'sonner';

type UseFileHandlerProps = {
  position: number;
};

export const useFileHandler = ({ position }: UseFileHandlerProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { activeShelfId, addBook, openModal } = useBookshelfStore();
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (typeof event.target?.result === 'string') {
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
            openModal(newBookId);
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
              }
            } else {
              toast.error('Invalid Lottie animation format');
            }
          } catch (e) {
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
