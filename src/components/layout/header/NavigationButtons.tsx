
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, Library } from 'lucide-react';

interface NavigationButtonsProps {
  isHomePage: boolean;
  isLibraryPage: boolean;
  onLibraryMenuOpen: () => void;
}

const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  isHomePage,
  isLibraryPage,
  onLibraryMenuOpen
}) => {
  return (
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
        onClick={onLibraryMenuOpen}
      >
        <Library className="h-4 w-4 group-hover:text-amber-300 transition-colors" />
        <span>Libraries</span>
      </Button>
    </div>
  );
};

export default NavigationButtons;
