
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useBookshelfStore } from "@/store/bookshelfStore";
import { 
  Palette, 
  Image, 
  CircleOff,
  CircleDashed,
  SquareDashedBottomCode,
  SquareStack,
  Layers,
  AppWindow
} from "lucide-react";

// Import tab content components
import GeneralTab from './tabs/GeneralTab';
import ContainerTab from './tabs/ContainerTab';
import ShelvesTab from './tabs/ShelvesTab';
import SlotsTab from './tabs/SlotsTab';
import HeaderTab from './tabs/HeaderTab';

export interface CustomizationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CustomizationModal: React.FC<CustomizationModalProps> = ({ 
  open,
  onOpenChange
}) => {
  // Get store actions
  const { saveCustomization, resetCustomization } = useBookshelfStore();
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            <Palette className="mr-2 h-5 w-5" /> 
            Ritual Shelf Customization
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="w-full justify-start mb-4 overflow-x-auto">
            <TabsTrigger value="general" className="flex items-center">
              <AppWindow className="mr-1 h-4 w-4" /> General
            </TabsTrigger>
            <TabsTrigger value="container" className="flex items-center">
              <SquareDashedBottomCode className="mr-1 h-4 w-4" /> Bookshelf Container
            </TabsTrigger>
            <TabsTrigger value="shelves" className="flex items-center">
              <SquareStack className="mr-1 h-4 w-4" /> Shelves & Dividers
            </TabsTrigger>
            <TabsTrigger value="slots" className="flex items-center">
              <Layers className="mr-1 h-4 w-4" /> Slots & Interactions
            </TabsTrigger>
            <TabsTrigger value="header" className="flex items-center">
              <Image className="mr-1 h-4 w-4" /> Header
            </TabsTrigger>
          </TabsList>
          
          {/* General Tab */}
          <TabsContent value="general" className="space-y-6">
            <GeneralTab />
          </TabsContent>
          
          {/* Container Tab */}
          <TabsContent value="container" className="space-y-6">
            <ContainerTab />
          </TabsContent>
          
          {/* Shelves Tab */}
          <TabsContent value="shelves" className="space-y-6">
            <ShelvesTab />
          </TabsContent>
          
          {/* Slots Tab */}
          <TabsContent value="slots" className="space-y-6">
            <SlotsTab />
          </TabsContent>
          
          {/* Header Tab */}
          <TabsContent value="header" className="space-y-6">
            <HeaderTab />
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="flex justify-between mt-6">
          <Button 
            variant="outline" 
            onClick={resetCustomization}
          >
            <CircleOff className="mr-2 h-4 w-4" />
            Reset to Defaults
          </Button>
          
          <div className="flex gap-2">
            <Button 
              variant="secondary" 
              onClick={() => onOpenChange(false)}
            >
              <CircleDashed className="mr-2 h-4 w-4" />
              Close
            </Button>
            
            <Button 
              onClick={() => {
                saveCustomization();
                onOpenChange(false);
              }}
            >
              <Palette className="mr-2 h-4 w-4" />
              Save Customization
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CustomizationModal;
