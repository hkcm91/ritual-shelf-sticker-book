
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Database } from "lucide-react";
import { storageService } from '../services/storage/storageService';
import { StorageBackend } from '../services/storage/types';
import StorageBackendSelector from './storage/StorageBackendSelector';
import StorageDetailsTab from './storage/StorageDetailsTab';
import StorageAdvancedTab from './storage/StorageAdvancedTab';

const StorageSettings: React.FC = () => {
  const [currentBackend, setCurrentBackend] = useState<StorageBackend>(
    storageService.getBackend()
  );
  
  const handleBackendChange = (backend: StorageBackend) => {
    setCurrentBackend(backend);
    storageService.setBackend(backend);
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
        <StorageBackendSelector 
          currentBackend={currentBackend} 
          onBackendChange={handleBackendChange} 
        />
        
        <Tabs defaultValue="details">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="space-y-4">
            <StorageDetailsTab currentBackend={currentBackend} />
          </TabsContent>
          
          <TabsContent value="advanced">
            <StorageAdvancedTab />
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
