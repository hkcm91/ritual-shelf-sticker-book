
import React, { useState } from 'react';
import { Settings, Rows3, Columns } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useBookshelfStore } from '../store/bookshelfStore';
import ShelfStylesDialog from './ShelfStylesDialog';
import StorageSettings from './StorageSettings';

const ShelfControls: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [openStyles, setOpenStyles] = useState(false);
  const { addRow, removeRow, addColumn, removeColumn, activeShelfId, shelves } = useBookshelfStore();
  
  const activeShelf = shelves[activeShelfId];
  
  const handleAddRow = () => {
    if (activeShelfId) {
      // Check the implementation of addRow in the store
      addRow();
    }
  };
  
  const handleRemoveRow = () => {
    if (activeShelfId && activeShelf && activeShelf.rows > 1) {
      // Check the implementation of removeRow in the store
      removeRow();
    }
  };
  
  const handleAddColumn = () => {
    if (activeShelfId) {
      // Check the implementation of addColumn in the store
      addColumn();
    }
  };
  
  const handleRemoveColumn = () => {
    if (activeShelfId && activeShelf && activeShelf.columns > 1) {
      // Check the implementation of removeColumn in the store
      removeColumn();
    }
  };
  
  return (
    <>
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
              Adjust your bookshelf layout and appearance
            </SheetDescription>
          </SheetHeader>
          
          <Tabs defaultValue="layout" className="mt-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="layout">Layout</TabsTrigger>
              <TabsTrigger value="appearance">Appearance</TabsTrigger>
              <TabsTrigger value="storage">Storage</TabsTrigger>
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
            
            <TabsContent value="appearance" className="mt-4">
              <Button variant="outline" onClick={() => setOpenStyles(true)}>
                Customize Shelf Appearance
              </Button>
            </TabsContent>
            
            <TabsContent value="storage" className="mt-4">
              <StorageSettings />
            </TabsContent>
          </Tabs>
        </SheetContent>
      </Sheet>
      
      {/* Fix the props for ShelfStylesDialog */}
      <ShelfStylesDialog />
    </>
  );
};

export default ShelfControls;
