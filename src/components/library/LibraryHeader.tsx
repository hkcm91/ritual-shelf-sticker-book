
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShelfData } from '@/store/types';
import { ArrowLeft, Settings, Trash2, Book, NotebookPen, Utensils, Music, BookMarked } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

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
    if (!currentLibrary) return <Book className="h-6 w-6" />;
    
    switch(currentLibrary.type) {
      case 'book': return <Book className="h-6 w-6 text-amber-400" />;
      case 'notebook': return <NotebookPen className="h-6 w-6 text-emerald-400" />;
      case 'recipe': return <Utensils className="h-6 w-6 text-rose-400" />;
      case 'music': return <Music className="h-6 w-6 text-purple-400" />;
      default: return <Book className="h-6 w-6 text-amber-400" />;
    }
  };

  const getHeaderGradient = () => {
    if (!currentLibrary) return 'from-purple-700/40 to-indigo-900/40';
    
    switch(currentLibrary.type) {
      case 'book': return 'from-amber-600/50 to-amber-900/50';
      case 'notebook': return 'from-emerald-600/50 to-emerald-900/50';
      case 'recipe': return 'from-rose-600/50 to-rose-900/50';
      case 'music': return 'from-purple-600/50 to-indigo-900/50';
      default: return 'from-amber-600/50 to-amber-900/50';
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
    <div className={`bg-gradient-to-r ${getHeaderGradient()} border-b border-white/10 py-5 px-4 sm:px-6 backdrop-blur-md shadow-lg`}>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              className={`hover:bg-white/20 ${getTextColor()} rounded-full transition-all duration-300 hover:scale-105 backdrop-blur-sm shadow-sm`}
              onClick={() => navigate('/widgets')}
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              <span>Back</span>
            </Button>
            
            <Card className={`flex items-center gap-3 px-5 py-2.5 ${getTextColor()} border-none bg-white/20 backdrop-blur-md shadow-xl rounded-full`}>
              <div className="p-2 rounded-full bg-white/30 shadow-inner">
                {libraryTypeIcon()}
              </div>
              <h1 className="text-xl font-semibold">
                {currentLibrary?.name || 'Library Collection'}
              </h1>
            </Card>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              className={`${getTextColor()} hover:bg-white/20 rounded-full transition-all duration-300 hover:scale-105 backdrop-blur-sm shadow-sm px-4 py-2`}
              onClick={onSettingsOpen}
            >
              <Settings className="h-4 w-4 mr-2" />
              <span>Settings</span>
            </Button>
            
            <Button
              variant="ghost"
              className="text-red-300 hover:bg-red-950/30 hover:text-red-200 rounded-full transition-all duration-300 hover:scale-105 backdrop-blur-sm shadow-sm px-4 py-2"
              onClick={onDeleteOpen}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              <span>Delete</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
