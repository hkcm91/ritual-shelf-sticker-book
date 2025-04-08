
import React, { useEffect, useState } from 'react';
import { Book, NotebookPen, Utensils, Music, FolderPlus } from 'lucide-react';
import { Link } from 'react-router-dom';
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
  const [scrolled, setScrolled] = useState(false);
  const [isCreateLibraryOpen, setIsCreateLibraryOpen] = useState(false);
  const [isLibraryMenuOpen, setIsLibraryMenuOpen] = useState(false);
  
  // Add scroll detection for shadow effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
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
          <Button 
            variant="ghost" 
            className="dropdown-trigger navigation-menu-item flex items-center gap-1.5 h-9 px-4 text-[color:var(--header-text-color,white)] hover:text-amber-200 group"
            onClick={() => setIsLibraryMenuOpen(true)}
          >
            <Book className="h-4 w-4 group-hover:text-amber-300 transition-colors" />
            <span>Widget Libraries</span>
          </Button>
        )}
      </div>
      
      <div className="flex items-center gap-3">
        {/* Widget Launcher Button */}
        <Link to="/widgets">
          <button 
            className="game-btn text-sm flex items-center gap-1.5 h-9 px-4 from-amber-900/40 to-amber-950/40 text-amber-100 border-amber-600/20 group"
          >
            <NotebookPen className="h-4 w-4 group-hover:text-amber-300 transition-colors" />
            <span>Sticker Book</span>
          </button>
        </Link>
        
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
            <Book className="h-5 w-5 text-amber-300" />
            <span>Widget Libraries</span>
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
          
          <div className="popup-section">
            <h3 className="font-medium text-amber-200/90 mb-2">Book Libraries</h3>
            <Link to="/" className="popup-item" onClick={() => setIsLibraryMenuOpen(false)}>
              <div className="popup-item-icon">
                <Book className="h-4 w-4" />
              </div>
              <div>
                <div className="font-medium">Main Library</div>
                <div className="text-xs text-amber-100/60">Your reading collection</div>
              </div>
            </Link>
          </div>
          
          <div className="popup-section">
            <h3 className="font-medium text-amber-200/90 mb-2">Notebook Libraries</h3>
            <Link to="/widgets" className="popup-item" onClick={() => setIsLibraryMenuOpen(false)}>
              <div className="popup-item-icon">
                <NotebookPen className="h-4 w-4" />
              </div>
              <div>
                <div className="font-medium">Sticker Book</div>
                <div className="text-xs text-amber-100/60">Creative stickers and notes</div>
              </div>
            </Link>
          </div>
          
          <div className="popup-section">
            <h3 className="font-medium text-amber-200/90 mb-2">Coming Soon</h3>
            <div className="space-y-3">
              <div className="popup-item opacity-60 cursor-not-allowed">
                <div className="popup-item-icon">
                  <Utensils className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-medium">Recipe Library</div>
                  <div className="text-xs text-amber-100/60">Your cooking collection</div>
                </div>
              </div>
              
              <div className="popup-item opacity-60 cursor-not-allowed">
                <div className="popup-item-icon">
                  <Music className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-medium">Music Library</div>
                  <div className="text-xs text-amber-100/60">Your audio collection</div>
                </div>
              </div>
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
