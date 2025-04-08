
import React from 'react';
import { ShelfData } from '@/store/types';
import { Settings, Trash2, Book, NotebookPen, Utensils, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LibraryHeaderProps {
  currentLibrary: ShelfData | null;
  onSettingsOpen: () => void;
  onDeleteOpen: () => void;
}

export const LibraryHeader: React.FC<LibraryHeaderProps> = ({
  currentLibrary,
  onSettingsOpen,
  onDeleteOpen
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
    <div className="flex items-center gap-4 ml-4">
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-full bg-white/20 shadow-inner">
          {libraryTypeIcon()}
        </div>
        <h1 className={`text-lg font-medium ${getTextColor()}`}>
          {currentLibrary?.name || 'Library Collection'}
        </h1>
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className={`${getTextColor()} hover:bg-white/10 rounded-full transition-all duration-300`}
          onClick={onSettingsOpen}
          title="Library Settings"
        >
          <Settings className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className="text-red-300 hover:bg-red-950/30 hover:text-red-200 rounded-full transition-all duration-300"
          onClick={onDeleteOpen}
          title="Delete Library"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
