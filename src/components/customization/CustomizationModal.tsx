
import React, { useRef, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { useBookshelfStore } from "@/store/bookshelfStore";
import { 
  Palette, 
  Image, 
  CircleDashed, 
  CircleOff,
  SquareDashedBottomCode,
  SquareStack,
  Layers,
  AppWindow,
  FileImage,
  XCircle
} from "lucide-react";
import { toast } from "sonner";
import ColorPicker from './ColorPicker';
import BorderStyleSelector from './BorderStyleSelector';

export interface CustomizationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CustomizationModal: React.FC<CustomizationModalProps> = ({ 
  open,
  onOpenChange
}) => {
  const fileInputContainerRef = useRef<HTMLInputElement>(null);
  const fileInputShelfRef = useRef<HTMLInputElement>(null);
  const fileInputHeaderRef = useRef<HTMLInputElement>(null);
  const fileInputPageRef = useRef<HTMLInputElement>(null);
  
  // Get store values and actions
  const {
    // Page
    page,
    updatePageBackground,
    updatePageBackgroundImage,
    
    // Container
    container,
    updateContainerBackground,
    updateContainerBackgroundImage,
    updateContainerOpacity,
    updateContainerBorder,
    updateContainerPadding,
    
    // Shelves
    shelves,
    updateShelfThickness,
    updateShelfColor,
    updateShelfBackgroundImage,
    updateShelfOpacity,
    toggleDividers,
    updateDividersSetting,
    
    // Slots
    slots,
    updateSlotSetting,
    
    // Header
    header,
    updateHeaderSetting,
    
    // General actions
    saveCustomization,
    resetCustomization
  } = useBookshelfStore();
  
  // Apply CSS variables whenever settings change
  useEffect(() => {
    const root = document.documentElement;
    
    // Page settings
    root.style.setProperty('--page-bg', page.background);
    root.style.setProperty('--page-bg-image', page.backgroundImage ? `url(${page.backgroundImage})` : 'none');
    
    // Container settings
    root.style.setProperty('--container-bg', container.background);
    root.style.setProperty('--container-bg-image', container.backgroundImage ? `url(${container.backgroundImage})` : 'none');
    root.style.setProperty('--container-opacity', container.opacity.toString());
    root.style.setProperty('--container-border-width', `${container.borderWidth}px`);
    root.style.setProperty('--container-border-style', container.borderStyle);
    root.style.setProperty('--container-border-color', container.borderColor);
    root.style.setProperty('--container-border-radius', `${container.borderRadius}px`);
    root.style.setProperty('--container-padding', `${container.padding}px`);
    
    // Shelf settings
    root.style.setProperty('--shelf-thickness', `${shelves.thickness}px`);
    root.style.setProperty('--shelf-color', shelves.color);
    root.style.setProperty('--shelf-bg-image', shelves.backgroundImage ? `url(${shelves.backgroundImage})` : 'none');
    root.style.setProperty('--shelf-opacity', shelves.opacity.toString());
    
    // Divider settings
    root.style.setProperty('--divider-thickness', `${shelves.dividers.thickness}px`);
    root.style.setProperty('--divider-color', shelves.dividers.color);
    
    // Slot settings
    root.style.setProperty('--add-button-bg', slots.addButtonBg);
    root.style.setProperty('--add-button-color', slots.addButtonColor);
    root.style.setProperty('--add-button-hover-bg', slots.addButtonHoverBg);
    root.style.setProperty('--toggle-inactive-color', slots.toggleInactiveColor);
    root.style.setProperty('--toggle-active-color', slots.toggleActiveColor);
    root.style.setProperty('--toggle-border-color', slots.toggleBorderColor);
    root.style.setProperty('--empty-hover-bg', slots.emptyHoverBg);
    
    // Header settings
    root.style.setProperty('--header-bg', header.background);
    root.style.setProperty('--header-bg-image', header.backgroundImage ? `url(${header.backgroundImage})` : 'none');
    root.style.setProperty('--header-text-color', header.textColor);
    
  }, [page, container, shelves, slots, header]);

  // Handle file uploads for images
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    updateFn: (url: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          try {
            updateFn(event.target.result as string);
          } catch (error) {
            console.error('Error loading image:', error);
            toast.error('Image may be too large. Try using a URL instead.');
          }
        }
      };
      reader.readAsDataURL(file);
    } else {
      toast.error('Only image files are supported');
    }
    
    // Reset the input
    e.target.value = '';
  };

  // Clear image selection
  const clearImage = (updateFn: (url: string) => void) => {
    updateFn('');
  };

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
            <div className="rounded-md border p-4 space-y-4">
              <h3 className="font-medium text-lg">Page Background</h3>
              
              <div className="space-y-2">
                <Label>Background Color</Label>
                <div className="flex items-center gap-2">
                  <ColorPicker 
                    color={page.background} 
                    onChange={updatePageBackground} 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Background Image</Label>
                <div className="flex flex-col gap-2">
                  <Input
                    type="text"
                    placeholder="Enter image URL"
                    value={page.backgroundImage}
                    onChange={(e) => updatePageBackgroundImage(e.target.value)}
                  />
                  
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputPageRef.current?.click()}
                      className="flex-1"
                    >
                      <FileImage className="mr-1 h-4 w-4" /> Upload Image
                    </Button>
                    
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => clearImage(updatePageBackgroundImage)}
                      disabled={!page.backgroundImage}
                    >
                      <XCircle className="mr-1 h-4 w-4" /> Clear
                    </Button>
                    
                    <input
                      ref={fileInputPageRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileChange(e, updatePageBackgroundImage)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Container Tab */}
          <TabsContent value="container" className="space-y-6">
            <div className="rounded-md border p-4 space-y-4">
              <h3 className="font-medium text-lg">Bookshelf Container</h3>
              
              <div className="space-y-2">
                <Label>Background Color</Label>
                <div className="flex items-center gap-2">
                  <ColorPicker 
                    color={container.background} 
                    onChange={updateContainerBackground} 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Background Image</Label>
                <div className="flex flex-col gap-2">
                  <Input
                    type="text"
                    placeholder="Enter image URL"
                    value={container.backgroundImage}
                    onChange={(e) => updateContainerBackgroundImage(e.target.value)}
                  />
                  
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputContainerRef.current?.click()}
                      className="flex-1"
                    >
                      <FileImage className="mr-1 h-4 w-4" /> Upload Image
                    </Button>
                    
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => clearImage(updateContainerBackgroundImage)}
                      disabled={!container.backgroundImage}
                    >
                      <CircleX className="mr-1 h-4 w-4" /> Clear
                    </Button>
                    
                    <input
                      ref={fileInputContainerRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileChange(e, updateContainerBackgroundImage)}
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Opacity</Label>
                  <span className="text-sm">{Math.round(container.opacity * 100)}%</span>
                </div>
                <Slider
                  value={[container.opacity * 100]}
                  min={20}
                  max={100}
                  step={5}
                  onValueChange={(value) => updateContainerOpacity(value[0] / 100)}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Border Color</Label>
                  <ColorPicker 
                    color={container.borderColor} 
                    onChange={(color) => updateContainerBorder('borderColor', color)} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Border Style</Label>
                  <BorderStyleSelector 
                    value={container.borderStyle}
                    onChange={(style) => updateContainerBorder('borderStyle', style)}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Border Width</Label>
                    <span className="text-sm">{container.borderWidth}px</span>
                  </div>
                  <Slider
                    value={[container.borderWidth]}
                    min={0}
                    max={10}
                    step={1}
                    onValueChange={(value) => updateContainerBorder('borderWidth', value[0])}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Border Radius</Label>
                    <span className="text-sm">{container.borderRadius}px</span>
                  </div>
                  <Slider
                    value={[container.borderRadius]}
                    min={0}
                    max={24}
                    step={1}
                    onValueChange={(value) => updateContainerBorder('borderRadius', value[0])}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Padding</Label>
                  <span className="text-sm">{container.padding}px</span>
                </div>
                <Slider
                  value={[container.padding]}
                  min={0}
                  max={48}
                  step={4}
                  onValueChange={(value) => updateContainerPadding(value[0])}
                />
              </div>
            </div>
          </TabsContent>
          
          {/* Shelves Tab */}
          <TabsContent value="shelves" className="space-y-6">
            <div className="rounded-md border p-4 space-y-4">
              <h3 className="font-medium text-lg">Shelf Appearance</h3>
              
              <div className="space-y-2">
                <Label>Shelf Color</Label>
                <ColorPicker 
                  color={shelves.color} 
                  onChange={updateShelfColor} 
                />
              </div>
              
              <div className="space-y-2">
                <Label>Shelf Texture</Label>
                <div className="flex flex-col gap-2">
                  <Input
                    type="text"
                    placeholder="Enter texture URL"
                    value={shelves.backgroundImage}
                    onChange={(e) => updateShelfBackgroundImage(e.target.value)}
                  />
                  
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputShelfRef.current?.click()}
                      className="flex-1"
                    >
                      <FileImage className="mr-1 h-4 w-4" /> Upload Texture
                    </Button>
                    
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => clearImage(updateShelfBackgroundImage)}
                      disabled={!shelves.backgroundImage}
                    >
                      <CircleX className="mr-1 h-4 w-4" /> Clear
                    </Button>
                    
                    <input
                      ref={fileInputShelfRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileChange(e, updateShelfBackgroundImage)}
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Shelf Thickness</Label>
                  <span className="text-sm">{shelves.thickness}px</span>
                </div>
                <Slider
                  value={[shelves.thickness]}
                  min={4}
                  max={40}
                  step={2}
                  onValueChange={(value) => updateShelfThickness(value[0])}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Opacity</Label>
                  <span className="text-sm">{Math.round(shelves.opacity * 100)}%</span>
                </div>
                <Slider
                  value={[shelves.opacity * 100]}
                  min={20}
                  max={100}
                  step={5}
                  onValueChange={(value) => updateShelfOpacity(value[0] / 100)}
                />
              </div>
            </div>
            
            <div className="rounded-md border p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-lg">Shelf Dividers</h3>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="dividers-enabled"
                    checked={shelves.dividers.enabled}
                    onCheckedChange={toggleDividers}
                  />
                  <Label htmlFor="dividers-enabled" className="cursor-pointer">
                    {shelves.dividers.enabled ? 'Enabled' : 'Disabled'}
                  </Label>
                </div>
              </div>
              
              <div className={shelves.dividers.enabled ? "" : "opacity-50 pointer-events-none"}>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Books Per Section</Label>
                    <span className="text-sm">{shelves.dividers.booksPerSection}</span>
                  </div>
                  <Slider
                    value={[shelves.dividers.booksPerSection]}
                    min={2}
                    max={8}
                    step={1}
                    onValueChange={(value) => updateDividersSetting('booksPerSection', value[0])}
                    disabled={!shelves.dividers.enabled}
                  />
                </div>
                
                <div className="space-y-2 mt-4">
                  <div className="flex justify-between">
                    <Label>Divider Thickness</Label>
                    <span className="text-sm">{shelves.dividers.thickness}px</span>
                  </div>
                  <Slider
                    value={[shelves.dividers.thickness]}
                    min={1}
                    max={10}
                    step={1}
                    onValueChange={(value) => updateDividersSetting('thickness', value[0])}
                    disabled={!shelves.dividers.enabled}
                  />
                </div>
                
                <div className="space-y-2 mt-4">
                  <Label>Divider Color</Label>
                  <ColorPicker 
                    color={shelves.dividers.color} 
                    onChange={(color) => updateDividersSetting('color', color)} 
                    disabled={!shelves.dividers.enabled}
                  />
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Slots Tab */}
          <TabsContent value="slots" className="space-y-6">
            <div className="rounded-md border p-4 space-y-4">
              <h3 className="font-medium text-lg">Empty Slot Add Button</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Button Background</Label>
                  <ColorPicker 
                    color={slots.addButtonBg} 
                    onChange={(color) => updateSlotSetting('addButtonBg', color)} 
                    allowAlpha
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Button Icon Color</Label>
                  <ColorPicker 
                    color={slots.addButtonColor} 
                    onChange={(color) => updateSlotSetting('addButtonColor', color)} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Button Hover Background</Label>
                  <ColorPicker 
                    color={slots.addButtonHoverBg} 
                    onChange={(color) => updateSlotSetting('addButtonHoverBg', color)} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Empty Slot Hover Background</Label>
                  <ColorPicker 
                    color={slots.emptyHoverBg} 
                    onChange={(color) => updateSlotSetting('emptyHoverBg', color)} 
                    allowAlpha
                  />
                </div>
              </div>
            </div>
            
            <div className="rounded-md border p-4 space-y-4">
              <h3 className="font-medium text-lg">Slot Type Toggle Dots</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Inactive Dot Color</Label>
                  <ColorPicker 
                    color={slots.toggleInactiveColor} 
                    onChange={(color) => updateSlotSetting('toggleInactiveColor', color)} 
                    allowAlpha
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Active Dot Color</Label>
                  <ColorPicker 
                    color={slots.toggleActiveColor} 
                    onChange={(color) => updateSlotSetting('toggleActiveColor', color)} 
                    allowAlpha
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Dot Border Color</Label>
                  <ColorPicker 
                    color={slots.toggleBorderColor} 
                    onChange={(color) => updateSlotSetting('toggleBorderColor', color)} 
                    allowAlpha
                  />
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Header Tab */}
          <TabsContent value="header" className="space-y-6">
            <div className="rounded-md border p-4 space-y-4">
              <h3 className="font-medium text-lg">Header Appearance</h3>
              
              <div className="space-y-2">
                <Label>Background Color</Label>
                <ColorPicker 
                  color={header.background} 
                  onChange={(color) => updateHeaderSetting('background', color)} 
                />
              </div>
              
              <div className="space-y-2">
                <Label>Background Image</Label>
                <div className="flex flex-col gap-2">
                  <Input
                    type="text"
                    placeholder="Enter image URL"
                    value={header.backgroundImage}
                    onChange={(e) => updateHeaderSetting('backgroundImage', e.target.value)}
                  />
                  
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputHeaderRef.current?.click()}
                      className="flex-1"
                    >
                      <FileImage className="mr-1 h-4 w-4" /> Upload Image
                    </Button>
                    
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => clearImage((url) => updateHeaderSetting('backgroundImage', url))}
                      disabled={!header.backgroundImage}
                    >
                      <CircleX className="mr-1 h-4 w-4" /> Clear
                    </Button>
                    
                    <input
                      ref={fileInputHeaderRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileChange(e, (url) => updateHeaderSetting('backgroundImage', url))}
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Text Color</Label>
                <ColorPicker 
                  color={header.textColor} 
                  onChange={(color) => updateHeaderSetting('textColor', color)} 
                />
              </div>
            </div>
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
