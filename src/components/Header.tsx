
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
          className="flex items-center gap-2"
        >
          <UserCircle className="h-5 w-5" />
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
          className="flex items-center gap-2"
        >
          <UserCircle className="h-5 w-5" />
          <span className="max-w-[100px] truncate">{user?.displayName || user?.email}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="flex items-center gap-2">
          <Cloud className="h-4 w-4" />
          <span>Cloud Storage</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSignOut} className="flex items-center gap-2 text-red-500">
          <LogOut className="h-4 w-4" />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default HeaderAuthButton;
