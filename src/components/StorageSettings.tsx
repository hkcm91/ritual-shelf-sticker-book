
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
    <Card className="w-full bg-amber-950/20 border border-amber-700/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-amber-300">
          <Database className="h-5 w-5" />
          Storage Settings
        </CardTitle>
        <CardDescription className="text-amber-200/70">
          Choose where to store your bookshelf data
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <StorageBackendSelector 
          currentBackend={currentBackend} 
          onBackendChange={handleBackendChange} 
        />
        
        <Tabs defaultValue="details">
          <TabsList className="grid w-full grid-cols-2 bg-amber-950/50 border border-amber-700/30">
            <TabsTrigger 
              value="details" 
              className="data-[state=active]:bg-amber-900/50 data-[state=active]:text-amber-100"
            >
              Details
            </TabsTrigger>
            <TabsTrigger 
              value="advanced" 
              className="data-[state=active]:bg-amber-900/50 data-[state=active]:text-amber-100"
            >
              Advanced
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="space-y-4 mt-4">
            <StorageDetailsTab currentBackend={currentBackend} />
          </TabsContent>
          
          <TabsContent value="advanced" className="mt-4">
            <StorageAdvancedTab />
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter>
        <p className="text-xs text-amber-200/60">
          Storage backend can be changed at any time, but data will not be automatically transferred.
        </p>
      </CardFooter>
    </Card>
  );
};

export default StorageSettings;
