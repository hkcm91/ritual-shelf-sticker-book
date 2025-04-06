
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Cloud, HardDrive } from "lucide-react";
import { StorageBackend } from '../../services/storage/types';
import { toast } from 'sonner';

interface StorageBackendSelectorProps {
  currentBackend: StorageBackend;
  onBackendChange: (backend: StorageBackend) => void;
}

const StorageBackendSelector: React.FC<StorageBackendSelectorProps> = ({
  currentBackend,
  onBackendChange
}) => {
  const handleBackendChange = (value: string) => {
    const backend = value as StorageBackend;
    onBackendChange(backend);
    
    if (backend === 'cloud') {
      toast.info('Cloud storage is not yet fully implemented', {
        description: 'Some features may not work as expected'
      });
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Storage Backend</label>
      <Select value={currentBackend} onValueChange={handleBackendChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select storage method" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="local" className="flex items-center">
            <div className="flex items-center gap-2">
              <HardDrive className="h-4 w-4" />
              <span>Local Storage</span>
            </div>
          </SelectItem>
          <SelectItem value="cloud" className="flex items-center">
            <div className="flex items-center gap-2">
              <Cloud className="h-4 w-4" />
              <span>Cloud Storage</span>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default StorageBackendSelector;
