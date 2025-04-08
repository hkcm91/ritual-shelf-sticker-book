
import React from 'react';
import { Book } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ShelfData } from '@/store/types';
import { ArrowLeft, Settings, Trash2 } from 'lucide-react';

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
  const navigate = useNavigate();

  const libraryTypeIcon = () => {
    if (!currentLibrary) return <Book />;
    
    switch(currentLibrary.type) {
      case 'book': return <Book className="h-5 w-5 text-amber-300" />;
      case 'notebook': return <Book className="h-5 w-5 text-emerald-300" />;
      case 'recipe': return <Book className="h-5 w-5 text-rose-300" />;
      case 'music': return <Book className="h-5 w-5 text-purple-300" />;
      default: return <Book className="h-5 w-5 text-amber-300" />;
    }
  };

  return (
    <div className="bg-gradient-to-r from-amber-900/20 to-amber-950/20 border-b border-amber-800/20 py-3 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="text-amber-200 hover:text-amber-100"
            onClick={() => navigate('/widgets')}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            <span>Back</span>
          </Button>
          
          <h1 className="text-xl font-semibold text-amber-100 flex items-center gap-2">
            {libraryTypeIcon()}
            <span>{currentLibrary?.name || 'Library'}</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="game-btn from-amber-900/40 to-amber-950/40 text-amber-100"
            onClick={onSettingsOpen}
          >
            <Settings className="h-4 w-4 mr-1" />
            <span>Settings</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="game-btn from-red-900/30 to-red-950/30 text-red-200 hover:text-red-100"
            onClick={onDeleteOpen}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            <span>Delete</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
