
import React, { useState, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { useBookshelfStore } from "@/store/bookshelfStore";
import { toast } from "sonner";
import { Paintbrush, Image, RefreshCw } from "lucide-react";

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
  
  // Load current values when dialog opens
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
    
    // Reset file input
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
    
    // Reset file input
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
          
          <TabsContent value="background" className="space-y-4 pt-4">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="bgColor">Color</Label>
              <Input
                id="bgColor"
                type="color"
                value={tempBackgroundColor}
                onChange={(e) => setTempBackgroundColor(e.target.value)}
                className="col-span-2 h-10"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="bgOpacity">Opacity</Label>
                <span className="text-sm text-muted-foreground">{Math.round(tempBackgroundOpacity * 100)}%</span>
              </div>
              <Slider
                id="bgOpacity"
                min={0}
                max={1}
                step={0.01}
                value={[tempBackgroundOpacity]}
                onValueChange={(values) => setTempBackgroundOpacity(values[0])}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bgImage">Background Image</Label>
              <div className="flex gap-2">
                <Input
                  ref={backgroundFileRef}
                  id="bgImage"
                  type="file"
                  accept="image/*"
                  onChange={handleBackgroundFileChange}
                  className="flex-1"
                />
                <Button 
                  type="button" 
                  variant="outline"
                  size="icon"
                  onClick={() => backgroundFileRef.current?.click()}
                >
                  <Image className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="shelves" className="space-y-4 pt-4">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="shelfColor">Color</Label>
              <Input
                id="shelfColor"
                type="color"
                value={tempShelfColor}
                onChange={(e) => setTempShelfColor(e.target.value)}
                className="col-span-2 h-10"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="shelfOpacity">Opacity</Label>
                <span className="text-sm text-muted-foreground">{Math.round(tempShelfOpacity * 100)}%</span>
              </div>
              <Slider
                id="shelfOpacity"
                min={0}
                max={1}
                step={0.01}
                value={[tempShelfOpacity]}
                onValueChange={(values) => setTempShelfOpacity(values[0])}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="textureImage">Shelf Texture</Label>
              <div className="flex gap-2">
                <Input
                  ref={textureFileRef}
                  id="textureImage"
                  type="file"
                  accept="image/*"
                  onChange={handleTextureFileChange}
                  className="flex-1"
                />
                <Button 
                  type="button" 
                  variant="outline"
                  size="icon"
                  onClick={() => textureFileRef.current?.click()}
                >
                  <Image className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Texture will be tiled across shelves
              </p>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="flex justify-between sm:justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Reset to Default
          </Button>
          <Button type="button" onClick={handleApplyStyles}>
            Apply Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShelfStylesDialog;
