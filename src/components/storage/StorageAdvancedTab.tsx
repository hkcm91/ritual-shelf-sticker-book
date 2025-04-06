
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, RefreshCw, Trash2 } from "lucide-react";
import { storageService } from '../../services/storage/storageService';
import DeleteDialog from '../DeleteDialog';
import { useBookshelfStore, initializeDefaultShelf } from '../../store/bookshelfStore';

const StorageAdvancedTab: React.FC = () => {
  const [isResetting, setIsResetting] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  
  // Get reset shelf method from the store
  const { books, shelves } = useBookshelfStore();
  
  const handleResetStorage = () => {
    setIsResetting(true);
    
    setTimeout(() => {
      const success = storageService.resetAllStorage();
      
      if (success) {
        // Refresh the page to reset the app state
        window.location.reload();
      } else {
        setIsResetting(false);
      }
    }, 500);
  };

  const handleShelfReset = () => {
    setIsResetting(true);
    
    setTimeout(() => {
      const success = storageService.resetBookshelfData();
      
      if (success) {
        // Create a default shelf if needed after the reset
        initializeDefaultShelf();
        // Refresh the page to reset the app state
        window.location.reload();
      } else {
        setIsResetting(false);
        setShowResetDialog(false);
      }
    }, 500);
  };
  
  return (
    <div className="space-y-4">
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Danger Zone</AlertTitle>
        <AlertDescription>
          These actions cannot be undone. Be careful when using these options.
        </AlertDescription>
      </Alert>
      
      <div className="space-y-4">
        {/* Shelf Reset Option */}
        <div className="rounded-lg border p-3">
          <h3 className="font-medium mb-2">Reset Bookshelf</h3>
          <p className="text-sm text-gray-500 mb-3">
            This will delete all your books and stickers but keep your application settings.
          </p>
          <Button 
            variant="destructive" 
            onClick={() => setShowResetDialog(true)}
            disabled={isResetting}
            className="flex items-center gap-2"
          >
            {isResetting ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Resetting...</span>
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4" />
                <span>Reset Bookshelf</span>
              </>
            )}
          </Button>
        </div>
        
        {/* All Storage Reset Option */}
        <div className="rounded-lg border p-3">
          <h3 className="font-medium mb-2">Reset All Storage</h3>
          <p className="text-sm text-gray-500 mb-3">
            This will delete all your books, shelves, and customizations.
          </p>
          <Button 
            variant="destructive" 
            onClick={handleResetStorage}
            disabled={isResetting}
            className="flex items-center gap-2"
          >
            {isResetting ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Resetting...</span>
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                <span>Reset All Storage</span>
              </>
            )}
          </Button>
        </div>
      </div>
      
      {/* Reset Bookshelf Confirmation Dialog */}
      <DeleteDialog
        open={showResetDialog}
        onOpenChange={setShowResetDialog}
        onConfirm={handleShelfReset}
        title="Reset Bookshelf?"
        description="This will delete all your books and stickers. This action cannot be undone."
      />
    </div>
  );
};

export default StorageAdvancedTab;
