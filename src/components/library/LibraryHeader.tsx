
import React from 'react';
import { ShelfData } from '@/store/types';
import { Book, NotebookPen, Utensils, Music } from 'lucide-react';

interface LibraryHeaderProps {
  currentLibrary: ShelfData | null;
}

export const LibraryHeader: React.FC<LibraryHeaderProps> = ({
  currentLibrary
}) => {
  const libraryTypeIcon = () => {
    if (!currentLibrary) return <Book className="h-5 w-5" />;
    
    switch(currentLibrary.type) {
      case 'book': return <Book className="h-5 w-5 text-amber-400" />;
      case 'notebook': return <NotebookPen className="h-5 w-5 text-emerald-400" />;
      case 'recipe': return <Utensils className="h-5 w-5 text-rose-400" />;
      case 'music': return <Music className="h-5 w-5 text-purple-400" />;
      default: return <Book className="h-5 w-5 text-amber-400" />;
    }
  };

  const getTextColor = () => {
    if (!currentLibrary) return 'text-purple-100';
    
    switch(currentLibrary.type) {
      case 'book': return 'text-amber-100';
      case 'notebook': return 'text-emerald-100';
      case 'recipe': return 'text-rose-100';
      case 'music': return 'text-purple-100';
      default: return 'text-amber-100';
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className="p-1.5 rounded-full bg-white/20 shadow-inner">
        {libraryTypeIcon()}
      </div>
      <h1 className={`text-lg font-medium ${getTextColor()}`}>
        {currentLibrary?.name || 'Library Collection'}
      </h1>
    </div>
  );
};
