
import React, { useEffect } from 'react';
import Book from '../Book';
import { BookData } from '@/store/bookshelfStore';
import StickerContent from '../StickerContent';
import ContextMenuWrapper from '../ContextMenuWrapper';
import { Popover, PopoverTrigger } from '@/components/ui/popover';
import SlotControls from '../SlotControls';

type BookContentProps = {
  book: BookData;
  scale: number;
  position2D: { x: number, y: number };
  rotation: number;
  handleStickerMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleRotate: (direction: 'cw' | 'ccw') => void;
  handleResetTransform: () => void;
  handleScaleChange: (scale: number) => void;
  setShowDeleteDialog: (show: boolean) => void;
  isAltDrag: boolean;
};

const BookContent: React.FC<BookContentProps> = ({
  book,
  scale,
  position2D,
  rotation,
  handleStickerMouseDown,
  handleRotate,
  handleResetTransform,
  handleScaleChange,
  setShowDeleteDialog,
  isAltDrag
}) => {
  // Enhanced debugging for rendering decisions
  useEffect(() => {
    console.log('BookContent rendering for book:', book.id);
    console.log('Book type:', book.isSticker ? 'Sticker' : 'Regular Book');
    console.log('Book data:', {
      hasTitle: !!book.title,
      hasAuthor: !!book.author,
      hasCoverURL: !!book.coverURL,
      coverURLLength: book.coverURL ? book.coverURL.length : 0,
      coverURLValue: book.coverURL ? `${book.coverURL.substring(0, 30)}...` : "undefined",
      position: book.position,
      shelfId: book.shelfId,
      hidden: book.hidden
    });
  }, [book]);

  if (!book) {
    console.error('BookContent received null/undefined book');
    return null;
  }
  
  // Add additional safety check to prevent rendering issues
  if (book.hidden === true) {
    console.warn('BookContent attempted to render hidden book:', book.id);
    // Render a minimal placeholder instead of hiding completely
    return (
      <div className="w-full h-full bg-gray-200 rounded-md flex items-center justify-center">
        <span className="text-gray-500 text-xs">Hidden Book</span>
      </div>
    );
  }
  
  // Render book
  if (!book.isSticker) {
    console.log('Rendering regular book component for:', book.id);
    return (
      <div className="w-full h-full" style={{ display: 'block', opacity: 1 }}>
        <Book data={book} />
      </div>
    );
  }
  
  // Render sticker with context menu
  console.log('Rendering sticker for:', book.id);
  return (
    <ContextMenuWrapper
      book={book}
      handleRotate={handleRotate}
      handleResetTransform={handleResetTransform}
      setShowDeleteDialog={setShowDeleteDialog}
    >
      <Popover>
        <PopoverTrigger asChild>
          <StickerContent 
            book={book}
            scale={scale}
            position2D={position2D}
            rotation={rotation}
            handleStickerMouseDown={handleStickerMouseDown}
            isAltDrag={isAltDrag}
          />
        </PopoverTrigger>
        <SlotControls 
          scale={scale}
          onScaleChange={handleScaleChange}
          onRotate={handleRotate}
          onResetTransform={handleResetTransform}
          onShowDeleteDialog={() => setShowDeleteDialog(true)}
          isLottie={typeof book.coverURL === 'string' && book.coverURL.startsWith('{')}
        />
      </Popover>
    </ContextMenuWrapper>
  );
};

export default BookContent;
