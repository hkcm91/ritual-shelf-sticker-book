
import React, { useEffect } from 'react';
import SignInForm from '../components/auth/SignInForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Auth: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Redirect to home if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col p-4">
      <header className="mb-8">
        <Link to="/">
          <Button variant="ghost" className="flex items-center gap-2">
            <ArrowLeft size={16} />
            <span>Back to Bookshelf</span>
          </Button>
        </Link>
      </header>
      
      <main className="flex-1 flex flex-col items-center justify-center">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Virtual Bookshelf</h1>
          <p className="text-gray-600">
            Sign in to save your bookshelf to the cloud and access it from anywhere
          </p>
        </div>
        
        <div className="w-full max-w-md">
          <SignInForm />
        </div>
        
        <p className="mt-8 text-sm text-gray-500 max-w-md text-center">
          Cloud storage enables you to access your bookshelf from any device and keeps 
          your library safe if your browser data gets cleared.
        </p>
      </main>
      
      <footer className="py-4 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Virtual Bookshelf App. All rights reserved.
      </footer>
    </div>
  );
};

export default Auth;
