import React, { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  Settings,
  Rows3,
  Columns,
  Palette,
  Save,
  Layout, 
} from 'lucide-react';
import { useBookshelfStore } from '@/store/bookshelfStore';
import ThemeSelector from './ThemeSelector';
import StorageSettings from '@/components/StorageSettings';

const SettingsDrawer: React.FC = () => {
  const [open, setOpen] = useState(false);
  const {
    addRow,
    removeRow,
    addColumn,
    removeColumn,
    activeShelfId,
    shelves,
    openCustomizationModal,
  } = useBookshelfStore();
  
  const activeShelf = shelves[activeShelfId];
  
  const handleAddRow = () => {
    if (activeShelfId) {
      addRow(activeShelfId);
    }
  };
  
  const handleRemoveRow = () => {
    if (activeShelfId && activeShelf && activeShelf.rows > 1) {
      removeRow(activeShelfId);
    }
  };
  
  const handleAddColumn = () => {
    if (activeShelfId) {
      addColumn(activeShelfId);
    }
  };
  
  const handleRemoveColumn = () => {
    if (activeShelfId && activeShelf && activeShelf.columns > 1) {
      removeColumn(activeShelfId);
    }
  };
  
  const handleOpenCustomization = () => {
    setOpen(false);
    setTimeout(() => {
      openCustomizationModal();
    }, 100);
  };
  
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="bg-white/90 hover:bg-white text-gray-700">
          <Settings className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Bookshelf Settings</SheetTitle>
          <SheetDescription>
            Adjust your bookshelf layout and storage
          </SheetDescription>
        </SheetHeader>
        
        <Tabs defaultValue="layout" className="mt-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="layout" className="flex items-center gap-1">
              <Layout className="h-3.5 w-3.5" />
              <span>Layout</span>
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center gap-1">
              <Palette className="h-3.5 w-3.5" />
              <span>Theme</span>
            </TabsTrigger>
            <TabsTrigger value="storage" className="flex items-center gap-1">
              <Save className="h-3.5 w-3.5" />
              <span>Storage</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="layout" className="mt-4 space-y-6">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Rows</h3>
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleRemoveRow}
                  disabled={!activeShelf || activeShelf.rows <= 1}
                  className="px-2"
                >
                  -
                </Button>
                <div className="flex items-center space-x-1">
                  <Rows3 className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">{activeShelf ? activeShelf.rows : 0}</span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleAddRow}
                  className="px-2"
                >
                  +
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Columns</h3>
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleRemoveColumn}
                  disabled={!activeShelf || activeShelf.columns <= 1}
                  className="px-2"
                >
                  -
                </Button>
                <div className="flex items-center space-x-1">
                  <Columns className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">{activeShelf ? activeShelf.columns : 0}</span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleAddColumn}
                  className="px-2"
                >
                  +
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="appearance" className="mt-4 space-y-6">
            <ThemeSelector />
            <div className="mt-4">
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={handleOpenCustomization}
              >
                <Palette className="mr-2 h-4 w-4" />
                Advanced Customization
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="storage" className="mt-4">
            <StorageSettings />
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
};

export default SettingsDrawer;
