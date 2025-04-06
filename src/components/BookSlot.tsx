import React, { useRef, useState, useEffect } from 'react';
import { useBookshelfStore } from '../store/bookshelfStore';
import Book from './Book';
import { toast } from 'sonner';
import Lottie from 'lottie-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Popover, PopoverContent, PopoverTrigger, PopoverArrow } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Trash2, RotateCcw, RotateCw, Image, Upload, Link, FileImage } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

type BookSlotProps = {
  position: number;
};

type SlotType = 'book' | 'sticker';

const BookSlot: React.FC<BookSlotProps> = ({ position }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const urlInputRef = useRef<HTMLInputElement>(null);
  const bgFileInputRef = useRef<HTMLInputElement>(null);
  const [slotType, setSlotType] = useState<SlotType>('book');
  const [bgColor, setBgColor] = useState<string>('transparent');
  const [bgImage, setBgImage] = useState<string | null>(null);
  const [scale, setScale] = useState<number>(1);
  const [position2D, setPosition2D] = useState<{ x: number, y: number }>({ x: 0, y: 0 });
  const [rotation, setRotation] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number, y: number }>({ x: 0, y: 0 });
  const [showUrlDialog, setShowUrlDialog] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
  const [showBgImageDialog, setShowBgImageDialog] = useState<boolean>(false);
  const [bgImageUrl, setBgImageUrl] = useState<string>('');
  
  const { 
    books, 
    activeShelfId, 
    addBook, 
    openModal, 
    getDraggedBook, 
    setDraggedBook,
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
          // Only update books if there's actual data and it's different from the current state
          if (booksData && Object.keys(booksData).length > 0) {
            // For each book in storage, check if it exists in state and add it if it doesn't
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
  
  // Save slot preference to local storage
  useEffect(() => {
    // Load saved background color and image if exists
    const savedBgColor = localStorage.getItem(`slot-${activeShelfId}-${position}-bg`);
    if (savedBgColor) {
      setBgColor(savedBgColor);
    }
    
    const savedBgImage = localStorage.getItem(`slot-${activeShelfId}-${position}-bg-image`);
    if (savedBgImage) {
      setBgImage(savedBgImage);
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
    
    // Load saved rotation if exists
    const savedRotation = localStorage.getItem(`slot-${activeShelfId}-${position}-rotation`);
    if (savedRotation) {
      setRotation(parseFloat(savedRotation));
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
  
  // Save rotation when it changes
  useEffect(() => {
    localStorage.setItem(`slot-${activeShelfId}-${position}-rotation`, rotation.toString());
  }, [rotation, activeShelfId, position]);
  
  // Save background image when it changes
  useEffect(() => {
    if (bgImage) {
      localStorage.setItem(`slot-${activeShelfId}-${position}-bg-image`, bgImage);
    } else {
      localStorage.removeItem(`slot-${activeShelfId}-${position}-bg-image`);
    }
  }, [bgImage, activeShelfId, position]);
  
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

  const handleBgFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (typeof event.target?.result === 'string') {
          setBgImage(event.target.result);
          toast.success('Background image added successfully');
          setShowBgImageDialog(false);
        }
      };
      reader.readAsDataURL(file);
    } else {
      toast.error('Only image files are supported for backgrounds');
    }
    
    if (bgFileInputRef.current) {
      bgFileInputRef.current.value = '';
    }
  };

  const handleUrlSubmit = () => {
    if (!imageUrl) return;
    
    // Check if URL ends with .json for Lottie
    const isLottieUrl = imageUrl.toLowerCase().endsWith('.json');
    
    if (isLottieUrl && slotType === 'sticker') {
      // Fetch Lottie JSON file
      fetch(imageUrl)
        .then(response => response.json())
        .then(data => {
          const newBookId = addBook({
            title: 'Sticker',
            author: 'Decoration',
            coverURL: JSON.stringify(data),
            progress: 0,
            rating: 0,
            position,
            shelfId: activeShelfId,
            isSticker: true
          });
          toast.success('Lottie sticker added from URL');
          setShowUrlDialog(false);
          setImageUrl('');
        })
        .catch(error => {
          toast.error('Failed to load Lottie file from URL');
          console.error('Error loading Lottie:', error);
        });
    } else {
      // Regular image URL
      const newBookId = addBook({
        title: slotType === 'sticker' ? 'Sticker' : '',
        author: slotType === 'sticker' ? 'Decoration' : '',
        coverURL: imageUrl,
        progress: 0,
        rating: 0,
        position,
        shelfId: activeShelfId,
        isSticker: slotType === 'sticker'
      });
      
      if (slotType === 'book') {
        openModal(newBookId);
      } else {
        toast.success('Image added from URL');
      }
      
      setShowUrlDialog(false);
      setImageUrl('');
    }
  };
  
  const handleBgImageUrlSubmit = () => {
    if (!bgImageUrl) return;
    
    setBgImage(bgImageUrl);
    toast.success('Background image added from URL');
    setShowBgImageDialog(false);
    setBgImageUrl('');
  };
  
  const handleClick = () => {
    if (!book) {
      fileInputRef.current?.click();
    }
  };
  
  const handleContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    
    // For empty slot, show customization options
    if (!book) {
      // Show a menu with background options
      const option = prompt('Choose an option:\n1. Change background color\n2. Set background image\n3. Remove background image', '1');
      
      if (option === '1') {
        const color = prompt('Enter background color (hex, rgb, or name):', bgColor === 'transparent' ? '' : bgColor);
        if (color !== null) {
          setBgColor(color || 'transparent');
        }
      } else if (option === '2') {
        // Show dialog for background image
        setShowBgImageDialog(true);
      } else if (option === '3') {
        setBgImage(null);
        toast.success('Background image removed');
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
    
    // First check if there are files being dropped
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      
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
        return;
      } 
      // For image files
      else if (file.type.startsWith('image/')) {
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
    toast.success('Sticker position, rotation, and scale reset');
  };
  
  const handleDeleteSticker = () => {
    if (book) {
      deleteBook(book.id);
      setShowDeleteDialog(false);
      toast.success('Sticker removed');
    }
  };
  
  const handleReplaceImage = () => {
    fileInputRef.current?.click();
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
  
  // Render Lottie if needed
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
        
        // For Lottie JSON
        if (book.coverURL.startsWith('{')) {
          // Parse Lottie JSON data
          const animationData = JSON.parse(book.coverURL);
          return (
            <Popover>
              <PopoverTrigger asChild>
                <div 
                  className="w-full h-full cursor-move"
                  style={stickerStyle}
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
              </PopoverTrigger>
              <PopoverContent className="w-64" side="top">
                <div className="space-y-2">
                  <h4 className="font-medium">Sticker Controls</h4>
                  <div className="flex justify-between items-center">
                    <span>Scale: {scale.toFixed(1)}x</span>
                    <div className="flex items-center space-x-1">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleScaleChange(Math.max(0.5, scale - 0.1))}
                        disabled={scale <= 0.5}
                      >
                        -
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleScaleChange(Math.min(3, scale + 0.1))}
                        disabled={scale >= 3}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Rotation</span>
                    <div className="flex items-center space-x-1">
                      <Button size="sm" variant="outline" onClick={() => handleRotate('ccw')}>
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleRotate('cw')}>
                        <RotateCw className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <Button size="sm" variant="outline" onClick={handleResetTransform}>
                      Reset
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleReplaceImage}>
                      <Image className="h-4 w-4 mr-1" />
                      Replace
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setShowUrlDialog(true)}>
                      <Link className="h-4 w-4 mr-1" />
                      URL
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => setShowDeleteDialog(true)}>
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
                <PopoverArrow className="fill-background" />
              </PopoverContent>
            </Popover>
          );
        } else {
          // For sticker images
          return (
            <Popover>
              <PopoverTrigger asChild>
                <div 
                  className="w-full h-full cursor-move"
                  onClick={(e) => e.stopPropagation()}
                  onMouseDown={handleStickerMouseDown}
                  style={{
                    backgroundImage: `url(${book.coverURL})`,
                    backgroundSize: 'contain',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    ...stickerStyle
                  }}
                />
              </PopoverTrigger>
              <PopoverContent className="w-64" side="top">
                <div className="space-y-2">
                  <h4 className="font-medium">Sticker Controls</h4>
                  <div className="flex justify-between items-center">
                    <span>Scale: {scale.toFixed(1)}x</span>
                    <div className="flex items-center space-x-1">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleScaleChange(Math.max(0.5, scale - 0.1))}
                        disabled={scale <= 0.5}
                      >
                        -
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleScaleChange(Math.min(3, scale + 0.1))}
                        disabled={scale >= 3}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Rotation</span>
                    <div className="flex items-center space-x-1">
                      <Button size="sm" variant="outline" onClick={() => handleRotate('ccw')}>
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleRotate('cw')}>
                        <RotateCw className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <Button size="sm" variant="outline" onClick={handleResetTransform}>
                      Reset
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleReplaceImage}>
                      <Image className="h-4 w-4 mr-1" />
                      Replace
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setShowUrlDialog(true)}>
                      <Link className="h-4 w-4 mr-1" />
                      URL
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => setShowDeleteDialog(true)}>
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
                <PopoverArrow className="fill-background" />
              </PopoverContent>
            </Popover>
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
    <>
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
        style={{ 
          backgroundColor: bgColor,
          backgroundImage: bgImage ? `url(${bgImage})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
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
            
            {/* Background customization hint */}
            <div className="absolute top-2 right-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6 bg-black/30 hover:bg-black/50 text-white/70 opacity-40 hover:opacity-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowBgImageDialog(true);
                      }}
                    >
                      <FileImage className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Set background image</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
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
      
      {/* URL Input Dialog */}
      <Dialog open={showUrlDialog} onOpenChange={setShowUrlDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Image from URL</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Enter image or Lottie JSON URL"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowUrlDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleUrlSubmit}>
              Add
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Background Image Dialog */}
      <Dialog open={showBgImageDialog} onOpenChange={setShowBgImageDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set Background Image</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Upload Image</h4>
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => bgFileInputRef.current?.click()}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <Upload className="h-4 w-4" />
                  <span>Choose File</span>
                </Button>
                <input
                  ref={bgFileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleBgFileChange}
                  className="hidden"
                />
              </div>
            </div>
            
            <div className="my-2">
              <div className="relative flex items-center">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="mx-3 text-xs text-gray-500">OR</span>
                <div className="flex-grow border-t border-gray-300"></div>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-2">Image URL</h4>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Enter image URL"
                value={bgImageUrl}
                onChange={(e) => setBgImageUrl(e.target.value)}
              />
            </div>
            
            {bgImage && (
              <div>
                <h4 className="text-sm font-medium mb-2">Current Background</h4>
                <div className="flex justify-between items-center">
                  <div className="h-16 w-16 border rounded overflow-hidden">
                    <img src={bgImage} alt="Current background" className="h-full w-full object-cover" />
                  </div>
                  <Button variant="destructive" size="sm" onClick={() => setBgImage(null)}>
                    Remove
                  </Button>
                </div>
              </div>
            )}
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowBgImageDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleBgImageUrlSubmit}
              disabled={!bgImageUrl}
            >
              Set URL Image
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <
