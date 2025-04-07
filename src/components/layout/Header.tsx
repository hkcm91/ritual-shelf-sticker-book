
import React from 'react';
import { Button } from '@/components/ui/button';
import { Menu, Plus, Search, Settings } from 'lucide-react';
import ShelfSelector from './ShelfSelector';
import { useBookshelfStore } from '@/store/bookshelfStore';
import ShelfControls from '../ShelfControls';
import BookSearchDrawer from '../BookSearchDrawer';
import { useMediaQuery } from '@/hooks/use-mobile';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from '@/lib/utils';

const Header: React.FC = () => {
  const { openCustomizationModal } = useBookshelfStore();
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  return (
    <header className="px-4 py-3 flex justify-between items-center shadow-md backdrop-blur-sm bg-background/95 sticky top-0 z-50 transition-all duration-200">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold">Ritual Bookshelf</h1>
        
        {!isMobile && (
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent">Collections</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="p-4 w-[220px]">
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
        
        <Button 
          variant="ghost" 
          size="sm"
          className="flex items-center gap-1"
          onClick={() => openCustomizationModal()}
        >
          <Settings className="h-4 w-4" />
          {!isMobile && <span>Customize</span>}
        </Button>
        
        <ShelfControls />
      </div>
    </header>
  );
};

export default Header;
