
import React from 'react';
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
  if (!book) return null;
  
  // Render book
  if (!book.isSticker) {
    return <Book data={book} />;
  }
  
  // Render sticker with context menu
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
