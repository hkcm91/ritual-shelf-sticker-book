
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Cloud, HardDrive, AlertTriangle } from "lucide-react";
import { StorageBackend } from '../../services/storage/types';
import StorageUsage from '../StorageUsage';

interface StorageDetailsTabProps {
  currentBackend: StorageBackend;
}

const StorageDetailsTab: React.FC<StorageDetailsTabProps> = ({ currentBackend }) => {
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
    </div>
  );
};

export default StorageDetailsTab;
