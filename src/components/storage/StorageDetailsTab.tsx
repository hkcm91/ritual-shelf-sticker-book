
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Cloud, HardDrive, AlertTriangle, LockIcon } from "lucide-react";
import { StorageBackend } from '../../services/storage/types';
import StorageUsage from '../StorageUsage';
import { useAuth } from '../../hooks/useAuth';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface StorageDetailsTabProps {
  currentBackend: StorageBackend;
}

const StorageDetailsTab: React.FC<StorageDetailsTabProps> = ({ currentBackend }) => {
  const { isAuthenticated, user } = useAuth();
  
  return (
    <div className="rounded-lg border p-3">
      <h3 className="font-medium mb-2">Current Storage Backend</h3>
      <div className="flex items-center gap-2 text-sm">
        {currentBackend === 'local' ? (
          <>
            <HardDrive className="h-4 w-4" />
            <span>Local Browser Storage</span>
          </>
        ) : (
          <>
            <Cloud className="h-4 w-4" />
            <span>Cloud Storage</span>
          </>
        )}
      </div>
      
      <StorageUsage />
      
      {currentBackend === 'local' && (
        <Alert variant="warning" className="mt-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Storage Limitations</AlertTitle>
          <AlertDescription>
            Local storage is limited to approximately 5MB and is tied to this browser.
            Your books won't be available on other devices.
          </AlertDescription>
        </Alert>
      )}
      
      {currentBackend === 'cloud' && !isAuthenticated && (
        <Alert variant="warning" className="mt-4">
          <LockIcon className="h-4 w-4" />
          <AlertTitle>Authentication Required</AlertTitle>
          <AlertDescription className="flex flex-col gap-2">
            <p>You need to sign in to use cloud storage.</p>
            <Link to="/auth">
              <Button size="sm" variant="outline" className="w-full">
                Sign In / Create Account
              </Button>
            </Link>
          </AlertDescription>
        </Alert>
      )}
      
      {currentBackend === 'cloud' && isAuthenticated && (
        <Alert variant="default" className="mt-4 bg-green-50">
          <Cloud className="h-4 w-4" />
          <AlertTitle>Cloud Storage Active</AlertTitle>
          <AlertDescription>
            Signed in as {user?.email || user?.displayName}. Your books will be synced across all your devices.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default StorageDetailsTab;
