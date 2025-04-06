import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { UserCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

// This is a component we'll use to add auth-related UI to the header
const HeaderAuthButton: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  
  return (
    <Link to="/auth">
      <Button 
        variant="ghost" 
        size="sm"
        className="flex items-center gap-2"
      >
        <UserCircle className="h-5 w-5" />
        <span>{isAuthenticated ? user?.displayName : 'Sign In'}</span>
      </Button>
    </Link>
  );
};

export default HeaderAuthButton;
