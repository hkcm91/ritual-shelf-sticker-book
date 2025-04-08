
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShelfData } from '@/store/types';
import { ArrowLeft, Settings, Trash2, Book, NotebookPen, Utensils, Music } from 'lucide-react';
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
    if (!currentLibrary) return 'from-amber-700/30 to-amber-900/30';
    
    switch(currentLibrary.type) {
      case 'book': return 'from-amber-700/40 to-amber-900/40';
      case 'notebook': return 'from-emerald-700/40 to-emerald-900/40';
      case 'recipe': return 'from-rose-700/40 to-rose-900/40';
      case 'music': return 'from-purple-700/40 to-purple-900/40';
      default: return 'from-amber-700/40 to-amber-900/40';
    }
  };
  
  const getTextColor = () => {
    if (!currentLibrary) return 'text-amber-100';
    
    switch(currentLibrary.type) {
      case 'book': return 'text-amber-100';
      case 'notebook': return 'text-emerald-100';
      case 'recipe': return 'text-rose-100';
      case 'music': return 'text-purple-100';
      default: return 'text-amber-100';
    }
  };

  return (
    <div className={`bg-gradient-to-r ${getHeaderGradient()} border-b border-amber-800/30 py-4 px-4 sm:px-6 backdrop-blur-sm`}>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              className={`hover:bg-white/10 ${getTextColor()} rounded-full transition-all duration-300 hover:scale-105`}
              onClick={() => navigate('/widgets')}
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              <span>Back</span>
            </Button>
            
            <Card className={`flex items-center gap-2 px-4 py-2 ${getTextColor()} border-none bg-white/10 backdrop-blur-md shadow-xl`}>
              <div className="p-2 rounded-full bg-white/20">
                {libraryTypeIcon()}
              </div>
              <h1 className="text-xl font-semibold">
                {currentLibrary?.name || 'Library'}
              </h1>
            </Card>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              className={`${getTextColor()} hover:bg-white/10 rounded-full transition-all duration-300 hover:scale-105 px-4 py-2`}
              onClick={onSettingsOpen}
            >
              <Settings className="h-4 w-4 mr-2" />
              <span>Settings</span>
            </Button>
            
            <Button
              variant="ghost"
              className="text-red-300 hover:bg-red-950/20 hover:text-red-200 rounded-full transition-all duration-300 hover:scale-105 px-4 py-2"
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
