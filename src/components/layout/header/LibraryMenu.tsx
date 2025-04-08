
import React, { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Book, NotebookPen, Utensils, Music, 
  FolderPlus, Library 
} from 'lucide-react';
import { PopupWindow } from '@/components/ui/popup-window';
import { useBookshelfStore } from "@/store/bookshelfStore";
import { CreateLibraryDialog } from '@/components/libraries/CreateLibraryDialog';

interface LibraryMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const LibraryMenu: React.FC<LibraryMenuProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { shelves } = useBookshelfStore();
  const [isCreateLibraryOpen, setIsCreateLibraryOpen] = React.useState(false);
  
  // Group libraries by type for the menu
  const groupedLibraries = useMemo(() => {
    const result: Record<string, any[]> = {};
    
    Object.values(shelves).forEach(shelf => {
      const type = shelf.type || 'book';
      if (!result[type]) {
        result[type] = [];
      }
      result[type].push(shelf);
    });
    
    return result;
  }, [shelves]);
  
  return (
    <>
      <PopupWindow
        isOpen={isOpen}
        onClose={onClose}
        title={
          <>
            <Library className="h-5 w-5 text-amber-300" />
            <span>My Libraries</span>
          </>
        }
        size="md"
      >
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="popup-section-title">Available Libraries</h3>
            <button 
              onClick={() => {
                onClose();
                setIsCreateLibraryOpen(true);
              }}
              className="flex items-center gap-1.5 text-amber-300 hover:text-amber-200 text-sm transition-colors group"
            >
              <FolderPlus className="h-3.5 w-3.5 group-hover:animate-pulse" />
              <span>New Library</span>
            </button>
          </div>
          
          {/* Show message if no libraries exist */}
          {Object.keys(groupedLibraries).length === 0 && (
            <div className="text-center py-4 text-amber-200/80 bg-amber-900/10 rounded-lg border border-amber-700/20">
              <p>You haven't created any libraries yet.</p>
              <button 
                onClick={() => {
                  onClose();
                  navigate('/widgets');
                }}
                className="mt-2 text-sm text-amber-300 hover:text-amber-200 underline"
              >
                Go to Library Launcher
              </button>
            </div>
          )}
          
          {/* Book Libraries */}
          {groupedLibraries['book'] && groupedLibraries['book'].length > 0 && (
            <div className="popup-section">
              <h3 className="font-medium text-amber-200/90 mb-2 flex items-center gap-1.5">
                <Book className="h-4 w-4" />
                <span>Book Libraries</span>
                <span className="ml-1 text-xs bg-amber-900/30 text-amber-200/70 px-1.5 py-0.5 rounded-full">
                  {groupedLibraries['book'].length}
                </span>
              </h3>
              <div className="space-y-1">
                {groupedLibraries['book'].map((library) => (
                  <Link 
                    key={library.id} 
                    to={`/library/${library.id}`} 
                    className="popup-item py-2" 
                    onClick={onClose}
                  >
                    <div className="popup-item-icon">
                      <Book className="h-4 w-4" />
                    </div>
                    <div className="truncate max-w-[200px]">
                      <div className="font-medium">{library.name}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
          
          {/* Notebook Libraries */}
          {groupedLibraries['notebook'] && groupedLibraries['notebook'].length > 0 && (
            <div className="popup-section">
              <h3 className="font-medium text-emerald-200/90 mb-2 flex items-center gap-1.5">
                <NotebookPen className="h-4 w-4" />
                <span>Notebook Libraries</span>
                <span className="ml-1 text-xs bg-emerald-900/30 text-emerald-200/70 px-1.5 py-0.5 rounded-full">
                  {groupedLibraries['notebook'].length}
                </span>
              </h3>
              <div className="space-y-1">
                {groupedLibraries['notebook'].map((library) => (
                  <Link 
                    key={library.id} 
                    to={`/library/${library.id}`} 
                    className="popup-item py-2 border-emerald-700/30 hover:bg-emerald-800/20" 
                    onClick={onClose}
                  >
                    <div className="popup-item-icon bg-emerald-950/50 border-emerald-700/30 text-emerald-300">
                      <NotebookPen className="h-4 w-4" />
                    </div>
                    <div className="truncate max-w-[200px]">
                      <div className="font-medium">{library.name}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
          
          {/* Recipe Libraries */}
          {groupedLibraries['recipe'] && groupedLibraries['recipe'].length > 0 && (
            <div className="popup-section">
              <h3 className="font-medium text-rose-200/90 mb-2 flex items-center gap-1.5">
                <Utensils className="h-4 w-4" />
                <span>Recipe Libraries</span>
                <span className="ml-1 text-xs bg-rose-900/30 text-rose-200/70 px-1.5 py-0.5 rounded-full">
                  {groupedLibraries['recipe'].length}
                </span>
              </h3>
              <div className="space-y-1">
                {groupedLibraries['recipe'].map((library) => (
                  <Link 
                    key={library.id} 
                    to={`/library/${library.id}`} 
                    className="popup-item py-2 border-rose-700/30 hover:bg-rose-800/20" 
                    onClick={onClose}
                  >
                    <div className="popup-item-icon bg-rose-950/50 border-rose-700/30 text-rose-300">
                      <Utensils className="h-4 w-4" />
                    </div>
                    <div className="truncate max-w-[200px]">
                      <div className="font-medium">{library.name}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
          
          <div className="popup-section">
            <h3 className="font-medium text-amber-200/90 mb-2">Quick Actions</h3>
            <div className="space-y-1">
              <Link 
                to="/widgets" 
                className="popup-item py-2.5" 
                onClick={onClose}
              >
                <div className="popup-item-icon">
                  <FolderPlus className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-medium">Library Manager</div>
                  <div className="text-xs text-amber-100/60">Create and manage libraries</div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </PopupWindow>

      {/* Create Library Dialog */}
      <CreateLibraryDialog 
        open={isCreateLibraryOpen}
        onOpenChange={setIsCreateLibraryOpen}
      />
    </>
  );
};

export default LibraryMenu;
