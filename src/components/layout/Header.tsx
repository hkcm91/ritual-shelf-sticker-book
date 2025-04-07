import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { BookOpen, Search } from 'lucide-react';
import ShelfSelector from './ShelfSelector';
import { useBookshelfStore } from '@/store/bookshelfStore';
import BookSearchDrawer from '../BookSearchDrawer';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import HeaderAuthButton from '../Header';
import SettingsDrawer from '../settings/SettingsDrawer';

const Header: React.FC = () => {
  const { setBookSearchOpen } = useBookshelfStore();
  const isMobile = useIsMobile();
  const [scrolled, setScrolled] = useState(false);
  
  // Add scroll detection for shadow effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  console.log("Header rendering");
  
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
        {/* Library Search button in the left section */}
        <Button 
          variant="ghost"
          size="icon"
          className="relative game-btn from-amber-900/40 to-amber-950/40"
          onClick={() => {
            console.log("Search button clicked");
            setBookSearchOpen(true);
          }}
        >
          <Search className="h-4 w-4" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-amber-400 rounded-full shadow-[0_0_6px_rgba(251,191,36,0.7)] animate-pulse"></span>
        </Button>
        
        {!isMobile && (
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger 
                  className="navigation-menu-item flex items-center gap-1.5 h-9 px-4 text-[color:var(--header-text-color,white)] hover:text-amber-200"
                >
                  <BookOpen className="h-4 w-4" />
                  <span>Collections</span>
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="p-4 w-[320px] rounded-md collections-dropdown">
                    <ShelfSelector />
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        )}
      </div>
      
      <div className="flex items-center gap-3">
        {/* Settings Drawer - keeping this as our single entry point to settings/customization */}
        <SettingsDrawer />
        
        <HeaderAuthButton />
      </div>
      
      {/* Render BookSearchDrawer component */}
      <BookSearchDrawer />
    </header>
  );
};

export default Header;
