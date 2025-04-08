
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { UserCircle, LogOut, Cloud, Sparkles, Settings, BookMarked } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'sonner';
import { PopupWindow } from '@/components/ui/popup-window';

const HeaderAuthButton: React.FC = () => {
  const { isAuthenticated, user, signOut } = useAuth();
  const [isAccountPopupOpen, setIsAccountPopupOpen] = useState(false);
  
  const handleSignOut = async () => {
    await signOut();
    setIsAccountPopupOpen(false);
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
    <>
      <Button 
        variant="ghost" 
        size="sm"
        onClick={() => setIsAccountPopupOpen(true)}
        className="game-btn from-amber-900/40 to-amber-950/40 hover:from-amber-900/50 hover:to-amber-950/50 text-amber-100 
          border-amber-600/20 flex items-center gap-1.5 group"
      >
        <Sparkles className="h-3.5 w-3.5 text-amber-300 group-hover:animate-pulse" />
        <span className="max-w-[100px] truncate">{user?.displayName || user?.email}</span>
      </Button>
      
      <PopupWindow
        isOpen={isAccountPopupOpen}
        onClose={() => setIsAccountPopupOpen(false)}
        title={
          <>
            <UserCircle className="h-5 w-5 text-amber-300" />
            <span>My Account</span>
          </>
        }
        size="sm"
      >
        <div className="space-y-4">
          <div className="popup-section">
            <h3 className="popup-section-title">Profile</h3>
            <div className="text-center py-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-900/30 border-2 border-amber-700/30 mb-2">
                <UserCircle className="h-10 w-10 text-amber-300/80" />
              </div>
              <div className="text-amber-100 font-medium">{user?.displayName || 'User'}</div>
              <div className="text-sm text-amber-300/60">{user?.email}</div>
            </div>
          </div>
          
          <div className="popup-section">
            <h3 className="popup-section-title">Quick Access</h3>
            <div className="popup-grid">
              <div className="popup-item">
                <div className="popup-item-icon">
                  <BookMarked className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-medium">My Libraries</div>
                  <div className="text-xs text-amber-100/60">Browse your collections</div>
                </div>
              </div>
              
              <div className="popup-item">
                <div className="popup-item-icon">
                  <Cloud className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-medium">Cloud Storage</div>
                  <div className="text-xs text-amber-100/60">Manage your files</div>
                </div>
              </div>
              
              <div className="popup-item">
                <div className="popup-item-icon">
                  <Settings className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-medium">Preferences</div>
                  <div className="text-xs text-amber-100/60">Customize your experience</div>
                </div>
              </div>
            </div>
          </div>
          
          <button 
            onClick={handleSignOut}
            className="w-full flex items-center gap-2 px-4 py-3 rounded-lg text-red-300 hover:bg-red-900/20 transition-colors border border-transparent hover:border-red-800/30"
          >
            <LogOut className="h-4 w-4 opacity-70" />
            <span>Sign Out</span>
          </button>
        </div>
      </PopupWindow>
    </>
  );
};

export default HeaderAuthButton;
