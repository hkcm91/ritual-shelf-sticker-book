
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, Cloud, Database, HardDrive, RefreshCw, Trash2 } from "lucide-react";
import { storageService, StorageBackend } from '../services/storageService';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from 'sonner';
import StorageUsage from './StorageUsage';

const StorageSettings: React.FC = () => {
  const [currentBackend, setCurrentBackend] = useState<StorageBackend>(
    storageService.getBackend()
  );
  const [isResetting, setIsResetting] = useState(false);
  
  const handleBackendChange = (value: string) => {
    const backend = value as StorageBackend;
    setCurrentBackend(backend);
    storageService.setBackend(backend);
    
    if (backend === 'cloud') {
      toast.info('Cloud storage is not yet fully implemented', {
        description: 'Some features may not work as expected'
      });
    }
  };
  
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
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Storage Settings
        </CardTitle>
        <CardDescription>
          Choose where to store your bookshelf data
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
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
        
        <Tabs defaultValue="details">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="space-y-4">
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
          </TabsContent>
          
          <TabsContent value="advanced">
            <div className="space-y-4">
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Danger Zone</AlertTitle>
                <AlertDescription>
                  These actions cannot be undone. Be careful when using these options.
                </AlertDescription>
              </Alert>
              
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
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter>
        <p className="text-xs text-gray-500">
          Storage backend can be changed at any time, but data will not be automatically transferred.
        </p>
      </CardFooter>
    </Card>
  );
};

export default StorageSettings;
