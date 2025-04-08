
import React from 'react';
import { Popover, PopoverTrigger } from '@/components/ui/popover';
import SlotControls from '../SlotControls';
import StickerContent from '../StickerContent';
import ContextMenuWrapper from '../ContextMenuWrapper';
import { BookData } from '@/store/bookshelfStore';

type StickerSlotContentProps = {
  book: BookData;
  scale: number;
  position2D: { x: number, y: number };
  rotation: number;
  isAltDrag: boolean;
  handleStickerMouseDown: (e: React.MouseEvent) => void;
  handleRotate: (direction: 'cw' | 'ccw') => void;
  handleScaleChange: (scale: number) => void;
  handleResetTransform: () => void;
  setShowDeleteDialog: (show: boolean) => void;
};

const StickerSlotContent: React.FC<StickerSlotContentProps> = ({
  book,
  scale,
  position2D,
  rotation,
  isAltDrag,
  handleStickerMouseDown,
  handleRotate,
  handleScaleChange,
  handleResetTransform,
  setShowDeleteDialog
}) => {
  if (!book || !book.isSticker) return null;
  
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
            zIndex={10}
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

export default StickerSlotContent;
