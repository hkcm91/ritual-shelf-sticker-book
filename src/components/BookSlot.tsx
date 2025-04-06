
import React, { useRef, useState, useEffect } from 'react';
import { useBookshelfStore } from '../store/bookshelfStore';
import Book from './Book';
import { toast } from 'sonner';
import Lottie from 'lottie-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type BookSlotProps = {
  position: number;
};

type SlotType = 'book' | 'sticker';

const BookSlot: React.FC<BookSlotProps> = ({ position }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [slotType, setSlotType] = useState<SlotType>('book');
  const [bgColor, setBgColor] = useState<string>('transparent');
  
  const { 
    books, 
    activeShelfId, 
    addBook, 
    openModal, 
    getDraggedBook, 
    setDraggedBook,
    updateBook
  } = useBookshelfStore();
  
  const book = Object.values(books).find(
    (book) => book.shelfId === activeShelfId && book.position === position
  );
  
  // Save slot preference to local storage
  useEffect(() => {
    // Load saved background color if exists
    const savedBgColor = localStorage.getItem(`slot-${activeShelfId}-${position}-bg`);
    if (savedBgColor) {
      setBgColor(savedBgColor);
    }
    
    const savedSlotType = localStorage.getItem(`slot-${activeShelfId}-${position}-type`);
    if (savedSlotType === 'book' || savedSlotType === 'sticker') {
      setSlotType(savedSlotType);
    }
  }, [activeShelfId, position]);
  
  // Save slot type to local storage when it changes
  useEffect(() => {
    localStorage.setItem(`slot-${activeShelfId}-${position}-type`, slotType);
  }, [slotType, activeShelfId, position]);
  
  // Save background color when it changes
  useEffect(() => {
    if (bgColor !== 'transparent') {
      localStorage.setItem(`slot-${activeShelfId}-${position}-bg`, bgColor);
    }
  }, [bgColor, activeShelfId, position]);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // For Lottie JSON files
    if (file.type === 'application/json' && slotType === 'sticker') {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (typeof event.target?.result === 'string') {
          try {
            // Validate that it's a proper Lottie JSON
            JSON.parse(event.target.result);
            
            const newBookId = addBook({
              title: 'Sticker',
              author: 'Decoration',
              coverURL: event.target.result,
              progress: 0,
              rating: 0,
              position,
              shelfId: activeShelfId,
              isSticker: true
            });
            
            toast.success('Lottie sticker added successfully');
          } catch (err) {
            toast.error('Invalid Lottie JSON file');
          }
        }
      };
      reader.readAsText(file);
    } 
    // For image files
    else {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (typeof event.target?.result === 'string') {
          const newBookId = addBook({
            title: slotType === 'sticker' ? 'Sticker' : '',
            author: slotType === 'sticker' ? 'Decoration' : '',
            coverURL: event.target.result,
            progress: 0,
            rating: 0,
            position,
            shelfId: activeShelfId,
            isSticker: slotType === 'sticker'
          });
          
          if (slotType === 'book') {
            openModal(newBookId);
          } else {
            toast.success('Sticker added successfully');
          }
        }
      };
      reader.readAsDataURL(file);
    }
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleClick = () => {
    if (!book) {
      fileInputRef.current?.click();
    }
  };
  
  const handleContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    
    // For empty slot, show color picker
    if (!book) {
      const color = prompt('Enter background color (hex, rgb, or name):', bgColor === 'transparent' ? '' : bgColor);
      if (color !== null) {
        setBgColor(color || 'transparent');
      }
    }
    return false;
  };
  
  // Handle drag over to allow drop
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };
  
  // Handle drop to place a book into this slot
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    
    const draggedBook = getDraggedBook();
    
    if (!draggedBook || book) return; // Only allow dropping onto empty slots
    
    // Update the draggedBook with the new position
    updateBook(draggedBook.id, {
      position: position,
      shelfId: activeShelfId
    });
    
    toast.success('Book moved successfully');
  };
  
  // Render Lottie if needed
  const renderBookContent = () => {
    if (!book) return null;
    
    if (book.isSticker && book.coverURL.startsWith('{')) {
      try {
        // Parse Lottie JSON data
        const animationData = JSON.parse(book.coverURL);
        return (
          <div className="w-full h-full">
            <Lottie 
              animationData={animationData} 
              loop={true} 
              autoplay={true}
              style={{ width: '100%', height: '100%' }}
            />
          </div>
        );
      } catch (e) {
        return <Book data={book} />;
      }
    } else {
      return <Book data={book} />;
    }
  };
  
  return (
    <div 
      className={`book-slot relative h-[220px] w-[150px] mx-1 rounded-sm
        ${!book ? 'hover:bg-gray-50/10' : ''}
        transition-colors duration-200 cursor-pointer`}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      style={{ backgroundColor: bgColor }}
    >
      {book ? (
        renderBookContent()
      ) : (
        <>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-5xl text-gray-300/20">+</span>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept={slotType === 'book' ? 'image/*' : 'image/*, application/json'}
            onChange={handleFileChange}
            className="hidden"
          />
          
          {/* Slot type toggle with circles */}
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-3 opacity-60 hover:opacity-100">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div 
                    className={`h-2.5 w-2.5 rounded-full cursor-pointer transition-all duration-200 ${slotType === 'book' ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/70'}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSlotType('book');
                    }}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Book Slot</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div 
                    className={`h-2.5 w-2.5 rounded-full cursor-pointer transition-all duration-200 ${slotType === 'sticker' ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/70'}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSlotType('sticker');
                    }}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Sticker Slot (supports Lottie files)</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </>
      )}
    </div>
  );
};

export default BookSlot;
