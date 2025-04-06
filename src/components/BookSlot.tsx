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
  const [scale, setScale] = useState<number>(1);
  const [position2D, setPosition2D] = useState<{ x: number, y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number, y: number }>({ x: 0, y: 0 });
  
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
    
    // Load saved scale and position if exists
    const savedScale = localStorage.getItem(`slot-${activeShelfId}-${position}-scale`);
    if (savedScale) {
      setScale(parseFloat(savedScale));
    }
    
    const savedPositionX = localStorage.getItem(`slot-${activeShelfId}-${position}-position-x`);
    const savedPositionY = localStorage.getItem(`slot-${activeShelfId}-${position}-position-y`);
    if (savedPositionX && savedPositionY) {
      setPosition2D({
        x: parseFloat(savedPositionX),
        y: parseFloat(savedPositionY)
      });
    }
  }, [activeShelfId, position]);
  
  // Save slot type to local storage when it changes
  useEffect(() => {
    localStorage.setItem(`slot-${activeShelfId}-${position}-type`, slotType);
  }, [slotType, activeShelfId, position]);
  
  // Save background color when it changes
  useEffect(() => {
    localStorage.setItem(`slot-${activeShelfId}-${position}-bg`, bgColor);
  }, [bgColor, activeShelfId, position]);
  
  // Save scale and position when they change
  useEffect(() => {
    localStorage.setItem(`slot-${activeShelfId}-${position}-scale`, scale.toString());
  }, [scale, activeShelfId, position]);
  
  useEffect(() => {
    localStorage.setItem(`slot-${activeShelfId}-${position}-position-x`, position2D.x.toString());
    localStorage.setItem(`slot-${activeShelfId}-${position}-position-y`, position2D.y.toString());
  }, [position2D, activeShelfId, position]);
  
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
    // For sticker, allow adjustment
    else if (book.isSticker) {
      const action = prompt('Enter "scale" followed by a number (e.g., "scale 1.5") or "reset" to reset position and scale:', '');
      if (action) {
        if (action.toLowerCase() === 'reset') {
          setScale(1);
          setPosition2D({ x: 0, y: 0 });
          toast.success('Sticker position and scale reset');
        } else if (action.toLowerCase().startsWith('scale ')) {
          try {
            const newScale = parseFloat(action.split(' ')[1]);
            if (!isNaN(newScale) && newScale > 0 && newScale <= 3) {
              setScale(newScale);
              toast.success(`Scale set to ${newScale}`);
            } else {
              toast.error('Scale must be between 0 and 3');
            }
          } catch (err) {
            toast.error('Invalid scale format');
          }
        }
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
  
  // Sticker drag management
  const handleStickerMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!book?.isSticker) return;
    
    e.stopPropagation();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position2D.x,
      y: e.clientY - position2D.y
    });
  };
  
  const handleStickerMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !book?.isSticker) return;
    
    e.stopPropagation();
    // Calculate new position with boundaries to keep within the slot
    const maxOffset = 50; // How far the sticker can be moved from center in any direction
    const newX = Math.max(-maxOffset, Math.min(maxOffset, e.clientX - dragStart.x));
    const newY = Math.max(-maxOffset, Math.min(maxOffset, e.clientY - dragStart.y));
    
    setPosition2D({
      x: newX,
      y: newY
    });
  };
  
  const handleStickerMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
    }
  };
  
  // Set up mouse move and up event listeners
  useEffect(() => {
    if (isDragging) {
      const handleMouseMove = (e: MouseEvent) => {
        const maxOffset = 50;
        const newX = Math.max(-maxOffset, Math.min(maxOffset, e.clientX - dragStart.x));
        const newY = Math.max(-maxOffset, Math.min(maxOffset, e.clientY - dragStart.y));
        
        setPosition2D({
          x: newX,
          y: newY
        });
      };
      
      const handleMouseUp = () => {
        setIsDragging(false);
      };
      
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragStart]);
  
  // Render Lottie if needed
  const renderBookContent = () => {
    if (!book) return null;
    
    if (book.isSticker) {
      try {
        if (book.coverURL.startsWith('{')) {
          // Parse Lottie JSON data
          const animationData = JSON.parse(book.coverURL);
          return (
            <div 
              className="w-full h-full cursor-move"
              style={{ 
                transform: `scale(${scale}) translate(${position2D.x / scale}px, ${position2D.y / scale}px)`,
                transformOrigin: 'center'
              }}
              onMouseDown={handleStickerMouseDown}
              onClick={(e) => e.stopPropagation()}
            >
              <Lottie 
                animationData={animationData} 
                loop={true} 
                autoplay={true}
                style={{ width: '100%', height: '100%' }}
              />
            </div>
          );
        } else {
          // For sticker images
          return (
            <div 
              className="w-full h-full cursor-move"
              onClick={(e) => e.stopPropagation()}
              onMouseDown={handleStickerMouseDown}
              style={{ 
                backgroundImage: `url(${book.coverURL})`,
                backgroundSize: 'contain',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                transform: `scale(${scale}) translate(${position2D.x / scale}px, ${position2D.y / scale}px)`,
                transformOrigin: 'center'
              }}
            />
          );
        }
      } catch (e) {
        // Fallback if there's an error with Lottie parsing
        return (
          <div className="flex items-center justify-center w-full h-full text-red-500">
            Invalid sticker
          </div>
        );
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
      onMouseMove={handleStickerMouseMove}
      onMouseUp={handleStickerMouseUp}
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
