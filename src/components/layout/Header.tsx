
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { useBookshelfStore } from "@/store/bookshelfStore";
import BookSearchDrawer from '../BookSearchDrawer';
import HeaderAuthButton from '../Header';
import UnifiedSettingsDrawer from '../settings/UnifiedSettingsDrawer';
import LibraryMenu from './header/LibraryMenu';
import NavigationButtons from './header/NavigationButtons';
import WidgetLauncherButton from './header/WidgetLauncherButton';

const Header: React.FC<React.PropsWithChildren> = ({ children }) => {
  const isMobile = useIsMobile();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [isLibraryMenuOpen, setIsLibraryMenuOpen] = useState(false);
  
  // Add scroll detection for shadow effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
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
          <NavigationButtons 
            isHomePage={isHomePage}
            isLibraryPage={isLibraryPage}
            onLibraryMenuOpen={() => setIsLibraryMenuOpen(true)}
          />
        )}

        {/* Render children (like LibraryHeader) here */}
        {children}
      </div>
      
      <div className="flex items-center gap-3">
        {/* Widget Launcher Button (only on non-library pages) */}
        {!isLibraryPage && <WidgetLauncherButton />}
        
        {/* Unified Settings Drawer */}
        <UnifiedSettingsDrawer />
        
        <HeaderAuthButton />
      </div>

      {/* Library Menu Popup */}
      <LibraryMenu 
        isOpen={isLibraryMenuOpen}
        onClose={() => setIsLibraryMenuOpen(false)}
      />
    </header>
  );
};

export default Header;
