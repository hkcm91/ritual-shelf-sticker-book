
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Palette, Settings, BookOpen } from 'lucide-react';
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
  const { openCustomizationModal } = useBookshelfStore();
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
      className={`px-4 sm:px-6 py-3 flex justify-between items-center sticky top-0 z-50 transition-all duration-200 ${scrolled ? 'shadow-lg' : ''}`}
      style={{
        backgroundColor: 'var(--header-bg)',
        backgroundImage: 'var(--header-bg-image, none)',
        color: 'var(--header-text-color, white)',
        backdropFilter: 'blur(8px)'
      }}
    >
      <div className="flex items-center gap-4">
        {/* Library Search button in the left section */}
        <BookSearchDrawer />
        
        {!isMobile && (
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger 
                  className="navigation-menu-item bg-[#1A1F2C]/90 h-9 px-4 text-[color:var(--header-text-color,white)] hover:text-[color:var(--header-text-color,white)] hover:bg-[#222836] border border-white/10 shadow-md rounded-md transition-all"
                >
                  Collections
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="p-4 w-[300px] rounded-md bg-[#1A1F2C]/95 backdrop-blur-md border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.4)]">
                    <ShelfSelector />
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        )}
      </div>
      
      <div className="flex items-center gap-3">
        {/* Settings Drawer */}
        <SettingsDrawer />
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                className="bg-[#1A1F2C]/80 hover:bg-[#222836] text-[color:var(--header-text-color,white)] hover:text-[color:var(--header-text-color,white)] border border-white/10 shadow-md"
                onClick={() => {
                  console.log("Customize button clicked");
                  openCustomizationModal();
                }}
              >
                <Palette className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-[#1A1F2C] border border-white/10 text-white">
              <p>Customize</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <HeaderAuthButton />
      </div>
    </header>
  );
};

export default Header;
