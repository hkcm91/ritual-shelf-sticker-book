
import React, { useState, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Paintbrush } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBookshelfStore } from "@/store/bookshelfStore";
import { toast } from "sonner";

// Import our new components
import BackgroundTabContent from './shelf-styles/BackgroundTabContent';
import ShelvesTabContent from './shelf-styles/ShelvesTabContent';
import StylesDialogFooter from './shelf-styles/DialogFooter';

const ShelfStylesDialog = () => {
  const { activeShelfId, shelves, updateShelf, resetShelfStyle } = useBookshelfStore();
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("background");
  const [tempBackgroundColor, setTempBackgroundColor] = useState("#4a5568");
  const [tempBackgroundOpacity, setTempBackgroundOpacity] = useState(0.8);
  const [tempShelfColor, setTempShelfColor] = useState("#8b5a2b");
  const [tempShelfOpacity, setTempShelfOpacity] = useState(1);
  
  const backgroundFileRef = useRef<HTMLInputElement>(null);
  const textureFileRef = useRef<HTMLInputElement>(null);
  
  const activeShelf = shelves[activeShelfId];
  
  React.useEffect(() => {
    if (open && activeShelf) {
      setTempBackgroundColor(activeShelf.backgroundColor || "#4a5568");
      setTempBackgroundOpacity(activeShelf.backgroundOpacity !== undefined ? activeShelf.backgroundOpacity : 0.8);
      setTempShelfColor(activeShelf.shelfColor || "#8b5a2b");
      setTempShelfOpacity(activeShelf.shelfOpacity !== undefined ? activeShelf.shelfOpacity : 1);
    }
  }, [open, activeShelf]);
  
  const handleBackgroundFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        updateShelf(activeShelfId, {
          backgroundImage: event.target.result as string
        });
        toast.success("Background image updated");
      }
    };
    reader.onerror = () => toast.error("Failed to read the image file");
    reader.readAsDataURL(file);
    
    if (backgroundFileRef.current) {
      backgroundFileRef.current.value = '';
    }
  };
  
  const handleTextureFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        updateShelf(activeShelfId, {
          textureImage: event.target.result as string
        });
        toast.success("Shelf texture updated");
      }
    };
    reader.onerror = () => toast.error("Failed to read the image file");
    reader.readAsDataURL(file);
    
    if (textureFileRef.current) {
      textureFileRef.current.value = '';
    }
  };
  
  const handleApplyStyles = () => {
    updateShelf(activeShelfId, {
      backgroundColor: tempBackgroundColor,
      backgroundOpacity: tempBackgroundOpacity,
      shelfColor: tempShelfColor,
      shelfOpacity: tempShelfOpacity
    });
    toast.success("Shelf styles updated");
    setOpen(false);
  };
  
  const handleReset = () => {
    resetShelfStyle(activeShelfId);
    setOpen(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Paintbrush className="mr-2 h-4 w-4" />
          Customize Shelf
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Customize Shelf</DialogTitle>
          <DialogDescription>
            Adjust the appearance of your bookshelf
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="background" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="background">Background</TabsTrigger>
            <TabsTrigger value="shelves">Shelves</TabsTrigger>
          </TabsList>
          
          <TabsContent value="background">
            <BackgroundTabContent 
              backgroundFileRef={backgroundFileRef}
              tempBackgroundColor={tempBackgroundColor}
              tempBackgroundOpacity={tempBackgroundOpacity}
              setTempBackgroundColor={setTempBackgroundColor}
              setTempBackgroundOpacity={setTempBackgroundOpacity}
              handleBackgroundFileChange={handleBackgroundFileChange}
            />
          </TabsContent>
          
          <TabsContent value="shelves">
            <ShelvesTabContent 
              textureFileRef={textureFileRef}
              tempShelfColor={tempShelfColor}
              tempShelfOpacity={tempShelfOpacity}
              setTempShelfColor={setTempShelfColor}
              setTempShelfOpacity={setTempShelfOpacity}
              handleTextureFileChange={handleTextureFileChange}
            />
          </TabsContent>
        </Tabs>
        
        <StylesDialogFooter 
          handleReset={handleReset}
          handleApply={handleApplyStyles}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ShelfStylesDialog;
