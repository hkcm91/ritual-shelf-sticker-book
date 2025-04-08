
import React from 'react';
import { Lightbulb } from 'lucide-react';
import { useBookshelfStore } from '@/store/bookshelfStore';

const InfoSection: React.FC = () => {
  const { activeShelfId, shelves } = useBookshelfStore();
  const libraryType = activeShelfId && shelves[activeShelfId] ? 
    shelves[activeShelfId].type || 'book' : 
    'book';

  const getLibrarySpecificInfo = () => {
    switch (libraryType) {
      case 'recipe':
        return "Recipe libraries support both recipe slots and stickers. Upload images of your favorite dishes!";
      case 'notebook':
        return "Notebook libraries support both notebook slots and stickers. Perfect for organizing your notes!";
      case 'music':
        return "Music libraries are perfect for cataloging your favorite music and playlists.";
      case 'book':
      default:
        return "Adjust rows and columns to customize the size of your bookshelf. Books in removed rows or columns will be hidden but not deleted.";
    }
  };

  const getTip = () => {
    switch (libraryType) {
      case 'recipe':
        return "For a better recipe display, use fewer columns (3-4) to make recipe images larger.";
      case 'notebook':
        return "For digital notebooks, use more rows to organize by categories.";
      case 'music':
        return "For music collections, organize albums by artist or genre using multiple rows.";
      case 'book':
      default:
        return "For mobile-friendly bookshelves, use fewer columns (4-6) and more rows.";
    }
  };
  
  return (
    <div className="mt-5 p-3 bg-amber-900/20 rounded-lg border border-amber-800/20 flex items-start gap-3">
      <Lightbulb className="h-5 w-5 text-amber-300 flex-shrink-0 mt-0.5" />
      <div className="text-xs text-amber-200/80 space-y-2">
        <p>
          {getLibrarySpecificInfo()}
        </p>
        <p>
          <strong>Tip:</strong> {getTip()}
        </p>
      </div>
    </div>
  );
};

export default InfoSection;
