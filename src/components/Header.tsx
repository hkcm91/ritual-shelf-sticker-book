
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { UserCircle, LogOut, Cloud, Sparkles, Settings, BookMarked } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'sonner';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const HeaderAuthButton: React.FC = () => {
  const { isAuthenticated, user, signOut } = useAuth();
  
  const handleSignOut = async () => {
    await signOut();
    toast.success('Signed out successfully');
  };
  
  if (!isAuthenticated) {
    return (
      <Link to="/auth">
        <Button 
          variant="ghost" 
          size="sm"
          className="game-btn from-amber-900/40 to-amber-950/40 text-amber-100 border-amber-600/20 flex items-center gap-1.5 group"
        >
          <UserCircle className="h-4 w-4 group-hover:text-amber-300 transition-colors" />
          <span>Sign In</span>
        </Button>
      </Link>
    );
  }
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm"
          className="dropdown-trigger game-btn from-amber-900/40 to-amber-950/40 hover:from-amber-900/50 hover:to-amber-950/50 text-amber-100 
            border-amber-600/20 flex items-center gap-1.5 group"
        >
          <Sparkles className="h-3.5 w-3.5 text-amber-300 group-hover:animate-pulse" />
          <span className="max-w-[100px] truncate">{user?.displayName || user?.email}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="popover-dropdown mt-1 min-w-[220px]"
      >
        <div className="dropdown-content">
          <DropdownMenuLabel className="dropdown-header">My Account</DropdownMenuLabel>
          <DropdownMenuSeparator className="dropdown-separator" />
          <DropdownMenuItem className="dropdown-item group">
            <BookMarked className="h-4 w-4 dropdown-icon" />
            <span>My Libraries</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="dropdown-item group">
            <Cloud className="h-4 w-4 dropdown-icon" />
            <span>Cloud Storage</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="dropdown-item group">
            <Settings className="h-4 w-4 dropdown-icon" />
            <span>Preferences</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="dropdown-separator" />
          <DropdownMenuItem 
            onClick={handleSignOut} 
            className="dropdown-item danger group"
          >
            <LogOut className="h-4 w-4 dropdown-icon" />
            <span>Sign Out</span>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default HeaderAuthButton;
