
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { UserCircle, LogOut, Cloud, Sparkles } from 'lucide-react';
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
          className="game-btn from-amber-900/40 to-amber-950/40 text-amber-100 border-amber-600/20 flex items-center gap-1.5"
        >
          <UserCircle className="h-4 w-4" />
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
          className="game-btn from-amber-900/40 to-amber-950/40 hover:from-amber-900/50 hover:to-amber-950/50 text-amber-100 
            border-amber-600/20 flex items-center gap-1.5"
        >
          <Sparkles className="h-3.5 w-3.5 text-amber-300" />
          <span className="max-w-[100px] truncate">{user?.displayName || user?.email}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="collections-dropdown mt-1 p-1.5 min-w-[200px]"
      >
        <DropdownMenuLabel className="text-amber-300/90 px-3 py-1.5 text-sm">My Account</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-amber-500/10 my-1" />
        <DropdownMenuItem className="flex items-center gap-2 hover:bg-amber-800/30 px-3 py-2 rounded-md cursor-pointer 
          text-amber-100 focus:bg-amber-800/30 focus:text-amber-100">
          <Cloud className="h-4 w-4" />
          <span>Cloud Storage</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={handleSignOut} 
          className="flex items-center gap-2 text-red-300 hover:bg-red-900/20 focus:bg-red-900/20 px-3 py-2 rounded-md cursor-pointer"
        >
          <LogOut className="h-4 w-4" />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default HeaderAuthButton;
