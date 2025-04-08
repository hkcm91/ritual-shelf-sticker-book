
import React, { useEffect, useState } from 'react';
import { Book, NotebookPen, Utensils, Music } from 'lucide-react';
import { Link } from 'react-router-dom';
import BookSearchDrawer from '../BookSearchDrawer';
import { useIsMobile } from '@/hooks/use-mobile';
import HeaderAuthButton from '../Header';
import SettingsDrawer from '../settings/SettingsDrawer';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const Header: React.FC = () => {
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
        {/* Book search drawer */}
        <BookSearchDrawer />
        
        {!isMobile && (
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger 
                  className="navigation-menu-item flex items-center gap-1.5 h-9 px-4 text-[color:var(--header-text-color,white)] hover:text-amber-200"
                >
                  <Book className="h-4 w-4" />
                  <span>Widget Libraries</span>
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="p-4 w-[300px] rounded-md collections-dropdown">
                    <h3 className="text-amber-300/90 font-semibold mb-3 collections-title">Library Types</h3>
                    
                    <div className="space-y-2">
                      <NavigationMenu>
                        <NavigationMenuList>
                          <NavigationMenuItem>
                            <NavigationMenuTrigger className="w-full flex items-center gap-2 hover:bg-amber-800/30 px-3 py-2 rounded-md cursor-pointer text-amber-100">
                              <Book className="h-4 w-4" />
                              <span>Book Library</span>
                            </NavigationMenuTrigger>
                            <NavigationMenuContent>
                              <div className="p-4 w-[300px] rounded-md collections-dropdown">
                                <h3 className="text-amber-300/90 font-semibold mb-3 collections-title">Book Libraries</h3>
                                <div className="space-y-2">
                                  <Link to="/" className="flex items-center gap-2 hover:bg-amber-800/30 px-3 py-2 rounded-md cursor-pointer text-amber-100">
                                    <span>Main Library</span>
                                  </Link>
                                  {/* More libraries would go here */}
                                </div>
                              </div>
                            </NavigationMenuContent>
                          </NavigationMenuItem>
                        </NavigationMenuList>
                      </NavigationMenu>
                      
                      <NavigationMenu>
                        <NavigationMenuList>
                          <NavigationMenuItem>
                            <NavigationMenuTrigger className="w-full flex items-center gap-2 hover:bg-amber-800/30 px-3 py-2 rounded-md cursor-pointer text-amber-100">
                              <NotebookPen className="h-4 w-4" />
                              <span>Notebook Library</span>
                            </NavigationMenuTrigger>
                            <NavigationMenuContent>
                              <div className="p-4 w-[300px] rounded-md collections-dropdown">
                                <h3 className="text-amber-300/90 font-semibold mb-3 collections-title">Notebook Libraries</h3>
                                <div className="space-y-2">
                                  <Link to="/widgets" className="flex items-center gap-2 hover:bg-amber-800/30 px-3 py-2 rounded-md cursor-pointer text-amber-100">
                                    <span>Sticker Book</span>
                                  </Link>
                                  {/* More libraries would go here */}
                                </div>
                              </div>
                            </NavigationMenuContent>
                          </NavigationMenuItem>
                        </NavigationMenuList>
                      </NavigationMenu>
                      
                      {/* Placeholder for future library types */}
                      <div className="flex items-center gap-2 text-amber-100/50 px-3 py-2 rounded-md">
                        <Utensils className="h-4 w-4" />
                        <span>Recipe Library (Coming Soon)</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-amber-100/50 px-3 py-2 rounded-md">
                        <Music className="h-4 w-4" />
                        <span>Music Library (Coming Soon)</span>
                      </div>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        )}
      </div>
      
      <div className="flex items-center gap-3">
        {/* Widget Launcher Button */}
        <Link to="/widgets">
          <button 
            className="game-btn text-sm flex items-center gap-1.5 h-9 px-4 from-amber-900/40 to-amber-950/40 text-amber-100 border-amber-600/20"
          >
            <NotebookPen className="h-4 w-4" />
            <span>Sticker Book</span>
          </button>
        </Link>
        
        {/* Settings Drawer */}
        <SettingsDrawer />
        
        <HeaderAuthButton />
      </div>
    </header>
  );
};

export default Header;
