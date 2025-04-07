
import React from 'react';
import Sticker from './Sticker';
import { useBookshelfStore } from '@/store/bookshelfStore';

interface StickerCanvasProps {
  shelfId: string;
}

const StickerCanvas: React.FC<StickerCanvasProps> = ({ shelfId }) => {
  const { books } = useBookshelfStore();
  
  // Filter for stickers (books with isSticker flag)
  const stickers = Object.values(books).filter(
    book => book.shelfId === shelfId && book.isSticker
  );
  
  return (
    <div className="sticker-canvas absolute inset-0 pointer-events-none overflow-hidden">
      {stickers.map(sticker => (
        <Sticker
          key={sticker.id}
          data={sticker}
        />
      ))}
    </div>
  );
};

export default StickerCanvas;
