
import React from 'react';
import SignInForm from '../components/auth/SignInForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Auth: React.FC = () => {
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
          Note: Cloud storage and synchronization features are coming soon.
          This sign-in page is a preview of upcoming functionality.
        </p>
      </main>
      
      <footer className="py-4 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Virtual Bookshelf App. All rights reserved.
      </footer>
    </div>
  );
};

export default Auth;
