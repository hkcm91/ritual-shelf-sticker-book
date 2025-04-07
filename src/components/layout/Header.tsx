
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Library, Palette, Settings } from 'lucide-react';
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
  
  return (
    <header className={`px-4 sm:px-6 py-3 flex justify-between items-center backdrop-blur-sm bg-background/95 sticky top-0 z-50 transition-all duration-200 ${scrolled ? 'scrolled' : ''}`}>
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold">Ritual Bookshelf</h1>
        
        {!isMobile && (
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent h-9 px-3">Collections</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="p-4 w-[240px] rounded-md">
                    <ShelfSelector />
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        )}
      </div>
      
      <div className="flex items-center gap-3">
        <BookSearchDrawer />
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                className="text-foreground/80 hover:text-foreground"
                onClick={() => openCustomizationModal()}
              >
                <Palette className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
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
