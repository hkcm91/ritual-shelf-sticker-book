
import React, { useEffect, useState } from 'react';
import { Book, NotebookPen, Utensils, Music, FolderPlus, Library, Home } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import BookSearchDrawer from '../BookSearchDrawer';
import { useIsMobile } from '@/hooks/use-mobile';
import HeaderAuthButton from '../Header';
import SettingsDrawer from '../settings/SettingsDrawer';
import { Button } from '@/components/ui/button';
import { useBookshelfStore } from "@/store/bookshelfStore";
import { toast } from 'sonner';
import { CreateLibraryDialog } from '../libraries/CreateLibraryDialog';
import { PopupWindow } from '@/components/ui/popup-window';

const Header: React.FC = () => {
  const isMobile = useIsMobile();
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [isCreateLibraryOpen, setIsCreateLibraryOpen] = useState(false);
  const [isLibraryMenuOpen, setIsLibraryMenuOpen] = useState(false);
  const { shelves } = useBookshelfStore();
  
  // Add scroll detection for shadow effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Group libraries by type for the menu
  const groupedLibraries = React.useMemo(() => {
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
  
  // Check if we're on a library-related page
  const isLibraryPage = location.pathname === '/widgets' || location.pathname.startsWith('/library/');
  const isHomePage = location.pathname === '/';
  
  return (
    <header 
      className={`px-4 sm:px-6 py-3 flex justify-between items-center sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'scrolled' : ''}`}
      style={{
        backgroundColor: 'var(--header-bg)',
        backgroundImage: 'var(--header-bg-image, none)',
        color: 'var(--header-text-color, white)',
        backdropFilter: 'blur(10px)'
      }}
    >
      <div className="flex items-center gap-4">
        {/* Book search drawer */}
        <BookSearchDrawer />
        
        {!isMobile && (
          <div className="flex items-center gap-2">
            {/* Home Button */}
            {!isHomePage && (
              <Link to="/">
                <Button 
                  variant="ghost" 
                  className="navigation-menu-item flex items-center gap-1.5 h-9 px-4 text-[color:var(--header-text-color,white)] hover:text-amber-200 group"
                >
                  <Home className="h-4 w-4 group-hover:text-amber-300 transition-colors" />
                  <span>Home</span>
                </Button>
              </Link>
            )}
            
            {/* Library Button */}
            <Button 
              variant="ghost" 
              className={`dropdown-trigger navigation-menu-item flex items-center gap-1.5 h-9 px-4 hover:text-amber-200 group
                ${isLibraryPage ? 'text-amber-300' : 'text-[color:var(--header-text-color,white)]'}`}
              onClick={() => setIsLibraryMenuOpen(true)}
            >
              <Library className="h-4 w-4 group-hover:text-amber-300 transition-colors" />
              <span>Libraries</span>
            </Button>
          </div>
        )}
      </div>
      
      <div className="flex items-center gap-3">
        {/* Widget Launcher Button (only on non-library pages) */}
        {!isLibraryPage && (
          <Link to="/widgets">
            <button 
              className="game-btn text-sm flex items-center gap-1.5 h-9 px-4 from-amber-900/40 to-amber-950/40 text-amber-100 border-amber-600/20 group"
            >
              <NotebookPen className="h-4 w-4 group-hover:text-amber-300 transition-colors" />
              <span>Sticker Book</span>
            </button>
          </Link>
        )}
        
        {/* Settings Drawer */}
        <SettingsDrawer />
        
        <HeaderAuthButton />
      </div>

      {/* Library Menu Popup */}
      <PopupWindow
        isOpen={isLibraryMenuOpen}
        onClose={() => setIsLibraryMenuOpen(false)}
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
                setIsLibraryMenuOpen(false);
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
                  setIsLibraryMenuOpen(false);
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
                    onClick={() => setIsLibraryMenuOpen(false)}
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
                    onClick={() => setIsLibraryMenuOpen(false)}
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
          
          <div className="popup-section">
            <h3 className="font-medium text-amber-200/90 mb-2">Quick Actions</h3>
            <div className="space-y-1">
              <Link 
                to="/widgets" 
                className="popup-item py-2.5" 
                onClick={() => setIsLibraryMenuOpen(false)}
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
    </header>
  );
};

export default Header;
