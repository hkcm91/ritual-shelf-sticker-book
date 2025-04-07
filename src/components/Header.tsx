
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { UserCircle, LogOut, Cloud } from 'lucide-react';
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
          className="bg-[#1A1F2C]/80 hover:bg-[#222836] text-[color:var(--header-text-color,white)] hover:text-white border border-white/10 shadow-md transition-all hover:translate-y-[-1px]"
        >
          <UserCircle className="h-4 w-4 mr-2" />
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
          className="bg-[#1A1F2C]/80 hover:bg-[#222836] text-[color:var(--header-text-color,white)] hover:text-white border border-white/10 shadow-md transition-all hover:translate-y-[-1px]"
        >
          <UserCircle className="h-4 w-4 mr-2" />
          <span className="max-w-[100px] truncate">{user?.displayName || user?.email}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-[#1A1F2C] border border-white/10 text-white shadow-[0_8px_30px_rgba(0,0,0,0.4)]">
        <DropdownMenuLabel className="text-white/70">My Account</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-white/10" />
        <DropdownMenuItem className="flex items-center gap-2 hover:bg-[#2C354A] focus:bg-[#2C354A] cursor-pointer">
          <Cloud className="h-4 w-4" />
          <span>Cloud Storage</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSignOut} className="flex items-center gap-2 text-red-400 hover:bg-[#2C354A] focus:bg-[#2C354A] cursor-pointer">
          <LogOut className="h-4 w-4" />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default HeaderAuthButton;
