import React, { useRef, useState, useEffect } from 'react';
import { useBookshelfStore } from '../store/bookshelfStore';
import Book from './Book';
import { toast } from 'sonner';
import Lottie from 'lottie-react';
import { Popover, PopoverTrigger } from '@/components/ui/popover';

// Import our components
import SlotControls from './SlotControls';
import StickerControls from './StickerControls';
import DeleteDialog from './DeleteDialog';

type BookSlotProps = {
  position: number;
};

const BookSlot: React.FC<BookSlotProps> = ({ position }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // State
  const [scale, setScale] = useState<number>(1);
  const [position2D, setPosition2D] = useState<{ x: number, y: number }>({ x: 0, y: 0 });
  const [rotation, setRotation] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number, y: number }>({ x: 0, y: 0 });
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
  
  // Store
  const { 
    books, 
    activeShelfId, 
    addBook, 
    openModal, 
    getDraggedBook, 
    updateBook,
    deleteBook
  } = useBookshelfStore();
  
  const book = Object.values(books).find(
    (book) => book.shelfId === activeShelfId && book.position === position
  );
  
  // Load books from localStorage on initial load
  useEffect(() => {
    const loadBooksFromStorage = () => {
      const storedBooks = localStorage.getItem('ritual-bookshelf-books');
      if (storedBooks) {
        try {
          const booksData = JSON.parse(storedBooks);
          if (booksData && Object.keys(booksData).length > 0) {
            Object.values(booksData).forEach((bookData: any) => {
              if (!books[bookData.id]) {
                addBook({
                  title: bookData.title,
                  author: bookData.author,
                  coverURL: bookData.coverURL,
                  progress: bookData.progress || 0,
                  rating: bookData.rating || 0,
                  position: bookData.position,
                  shelfId: bookData.shelfId,
                  isSticker: bookData.isSticker || false,
                  series: bookData.series,
                  characters: bookData.characters,
                  plot: bookData.plot,
                  notes: bookData.notes,
                  quizzes: bookData.quizzes
                });
              }
            });
          }
        } catch (error) {
          console.error('Error loading books from localStorage:', error);
        }
      }
    };
    
    loadBooksFromStorage();
  }, []);
  
  // Save books to localStorage when they change
  useEffect(() => {
    if (Object.keys(books).length > 0) {
      localStorage.setItem('ritual-bookshelf-books', JSON.stringify(books));
    }
  }, [books]);
  
  // Save scale and position preferences
  useEffect(() => {
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
    
    const savedRotation = localStorage.getItem(`slot-${activeShelfId}-${position}-rotation`);
    if (savedRotation) {
      setRotation(parseFloat(savedRotation));
    }
  }, [activeShelfId, position]);
  
  // Save scale and position when they change
  useEffect(() => {
    localStorage.setItem(`slot-${activeShelfId}-${position}-scale`, scale.toString());
  }, [scale, activeShelfId, position]);
  
  useEffect(() => {
    localStorage.setItem(`slot-${activeShelfId}-${position}-position-x`, position2D.x.toString());
    localStorage.setItem(`slot-${activeShelfId}-${position}-position-y`, position2D.y.toString());
  }, [position2D, activeShelfId, position]);
  
  // Save rotation when it changes
  useEffect(() => {
    localStorage.setItem(`slot-${activeShelfId}-${position}-rotation`, rotation.toString());
  }, [rotation, activeShelfId, position]);
  
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
          
          openModal(newBookId);
        }
      };
      reader.readAsDataURL(file);
    } else {
      toast.error('Only image files are supported for books');
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
  
  // Handle drag over to allow drop
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };
  
  // Handle drop to place a book into this slot
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    
    const draggedBook = getDraggedBook();
    
    // First check if there are files being dropped
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      
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
            
            openModal(newBookId);
          }
        };
        reader.readAsDataURL(file);
        return;
      }
    }
    
    // If there's no file being dropped, check for book drag
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
    // Calculate new position with expanded boundaries to allow full slot movement
    const slotWidth = 150; // Width of the book slot
    const slotHeight = 220; // Height of the book slot
    const maxOffset = Math.max(slotWidth, slotHeight); // Maximum offset based on slot dimensions
    
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
  
  const handleRotate = (direction: 'cw' | 'ccw') => {
    const rotationAmount = 15; // degrees
    setRotation(prev => direction === 'cw' ? prev + rotationAmount : prev - rotationAmount);
  };
  
  const handleScaleChange = (newScale: number) => {
    if (newScale > 0 && newScale <= 3) {
      setScale(newScale);
    }
  };
  
  const handleResetTransform = () => {
    setScale(1);
    setPosition2D({ x: 0, y: 0 });
    setRotation(0);
    toast.success('Position, rotation, and scale reset');
  };
  
  const handleDeleteSticker = () => {
    if (book) {
      deleteBook(book.id);
      setShowDeleteDialog(false);
      toast.success('Item removed');
    }
  };
  
  // Set up mouse move and up event listeners
  useEffect(() => {
    if (isDragging) {
      const handleMouseMove = (e: MouseEvent) => {
        const slotWidth = 150;
        const slotHeight = 220;
        const maxOffset = Math.max(slotWidth, slotHeight);
        
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
  
  // Render book content based on type
  const renderBookContent = () => {
    if (!book) return null;
    
    if (book.isSticker) {
      try {
        // Common style for all stickers
        const stickerStyle = {
          transform: `scale(${scale}) translate(${position2D.x / scale}px, ${position2D.y / scale}px) rotate(${rotation}deg)`,
          transformOrigin: 'center',
          width: '100%',
          height: '100%'
        };
        
        // Check if it's a Lottie JSON
        let isLottie = false;
        let animationData = null;
        
        if (typeof book.coverURL === 'string' && book.coverURL.startsWith('{')) {
          try {
            animationData = JSON.parse(book.coverURL);
            isLottie = true;
          } catch (e) {
            isLottie = false;
          }
        }
        
        return (
          <Popover>
            <PopoverTrigger asChild>
              <div 
                className="w-full h-full cursor-move"
                onClick={(e) => e.stopPropagation()}
                onMouseDown={handleStickerMouseDown}
                style={isLottie ? stickerStyle : {
                  backgroundImage: `url(${book.coverURL})`,
                  backgroundSize: 'contain',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  ...stickerStyle
                }}
              >
                {isLottie && animationData && (
                  <div className="w-full h-full flex items-center justify-center">
                    <Lottie 
                      animationData={animationData} 
                      loop={true} 
                      autoplay={true}
                      style={{ width: '100%', height: '100%' }}
                    />
                  </div>
                )}
              </div>
            </PopoverTrigger>
            <SlotControls 
              scale={scale}
              onScaleChange={handleScaleChange}
              onRotate={handleRotate}
              onResetTransform={handleResetTransform}
              onShowDeleteDialog={() => setShowDeleteDialog(true)}
              isLottie={isLottie}
            />
          </Popover>
        );
      } catch (e) {
        // Fallback if there's an error
        console.error("Error rendering sticker:", e);
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
    <>
      <div 
        className={`book-slot relative h-[220px] w-[150px] mx-1 rounded-sm
          ${!book ? 'hover:bg-gray-50/10' : 'hover:border hover:border-primary/30'}
          transition-colors duration-200 cursor-pointer`}
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onMouseMove={handleStickerMouseMove}
        onMouseUp={handleStickerMouseUp}
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
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </>
        )}
      </div>
      
      {/* Delete Confirmation Dialog */}
      <DeleteDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDeleteSticker}
        title="Delete Item?"
        description="This action cannot be undone."
      />
    </>
  );
};

export default BookSlot;
