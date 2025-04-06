
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { 
  Palette, 
  Settings, 
  RefreshCw
} from 'lucide-react';
import {
  Popover,
  PopoverTrigger,
  PopoverContent
} from '@/components/ui/popover';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { toast } from 'sonner';

export type CustomizationState = {
  containerBgImage: string;
  containerBgColor: string;
  containerOpacity: number;
  shelfBgImage: string;
  shelfBgColor: string;
  shelfOpacity: number;
  isCustomizationOpen: boolean;
};

type CustomizationPanelProps = {
  customization: CustomizationState;
  setCustomization: React.Dispatch<React.SetStateAction<CustomizationState>>;
  activeShelfId: string;
  saveCustomization: () => void;
  resetCustomization: () => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>, target: 'container' | 'shelf') => void;
  handleImageUrl: (url: string, target: 'container' | 'shelf') => void;
};

const CustomizationPanel: React.FC<CustomizationPanelProps> = ({
  customization,
  setCustomization,
  activeShelfId,
  saveCustomization,
  resetCustomization,
  handleFileChange,
  handleImageUrl
}) => {
  return (
    <Popover open={customization.isCustomizationOpen} onOpenChange={(open) => 
      setCustomization(prev => ({...prev, isCustomizationOpen: open}))
    }>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className="absolute top-4 right-4 z-10 bg-background/80 backdrop-blur-sm"
        >
          <Palette className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="end">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center">
            <Settings className="h-4 w-4 mr-2" /> Bookshelf Customization
          </h3>
          
          <Accordion type="single" collapsible defaultValue="container">
            {/* Container customization */}
            <AccordionItem value="container">
              <AccordionTrigger className="text-sm font-medium py-2">
                Bookshelf Background
              </AccordionTrigger>
              <AccordionContent className="space-y-3 pt-2">
                <div className="space-y-2">
                  <label className="text-xs font-medium">Background Image</label>
                  <div className="flex items-center space-x-2">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'container')}
                      className="text-xs h-8"
                    />
                  </div>
                  <div className="flex items-center space-x-2 mt-2">
                    <Input
                      type="text"
                      placeholder="Or enter image URL"
                      className="text-xs h-8"
                      value={customization.containerBgImage}
                      onChange={(e) => setCustomization(prev => ({
                        ...prev, 
                        containerBgImage: e.target.value
                      }))}
                      onBlur={() => handleImageUrl(customization.containerBgImage, 'container')}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-medium">Background Color</label>
                  <div className="flex items-center space-x-2">
                    <Input
                      type="color"
                      value={customization.containerBgColor}
                      onChange={(e) => setCustomization(prev => ({
                        ...prev, 
                        containerBgColor: e.target.value
                      }))}
                      onBlur={saveCustomization}
                      className="w-16 h-8 p-1"
                    />
                    <Input
                      type="text"
                      value={customization.containerBgColor}
                      onChange={(e) => setCustomization(prev => ({
                        ...prev, 
                        containerBgColor: e.target.value
                      }))}
                      onBlur={saveCustomization}
                      className="flex-1 h-8 text-xs"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-medium">Opacity</label>
                    <span className="text-xs">
                      {Math.round(customization.containerOpacity * 100)}%
                    </span>
                  </div>
                  <Slider
                    value={[customization.containerOpacity * 100]}
                    min={20}
                    max={100}
                    step={5}
                    onValueChange={(value) => setCustomization(prev => ({
                      ...prev, 
                      containerOpacity: value[0] / 100
                    }))}
                    onValueCommit={saveCustomization}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
            
            {/* Shelf customization */}
            <AccordionItem value="shelf">
              <AccordionTrigger className="text-sm font-medium py-2">
                Shelf Appearance
              </AccordionTrigger>
              <AccordionContent className="space-y-3 pt-2">
                <div className="space-y-2">
                  <label className="text-xs font-medium">Shelf Texture</label>
                  <div className="flex items-center space-x-2">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'shelf')}
                      className="text-xs h-8"
                    />
                  </div>
                  <div className="flex items-center space-x-2 mt-2">
                    <Input
                      type="text"
                      placeholder="Or enter texture URL"
                      className="text-xs h-8"
                      value={customization.shelfBgImage}
                      onChange={(e) => setCustomization(prev => ({
                        ...prev, 
                        shelfBgImage: e.target.value
                      }))}
                      onBlur={() => handleImageUrl(customization.shelfBgImage, 'shelf')}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-medium">Shelf Color</label>
                  <div className="flex items-center space-x-2">
                    <Input
                      type="color"
                      value={customization.shelfBgColor}
                      onChange={(e) => setCustomization(prev => ({
                        ...prev, 
                        shelfBgColor: e.target.value
                      }))}
                      onBlur={saveCustomization}
                      className="w-16 h-8 p-1"
                    />
                    <Input
                      type="text"
                      value={customization.shelfBgColor}
                      onChange={(e) => setCustomization(prev => ({
                        ...prev, 
                        shelfBgColor: e.target.value
                      }))}
                      onBlur={saveCustomization}
                      className="flex-1 h-8 text-xs"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-medium">Opacity</label>
                    <span className="text-xs">
                      {Math.round(customization.shelfOpacity * 100)}%
                    </span>
                  </div>
                  <Slider
                    value={[customization.shelfOpacity * 100]}
                    min={20}
                    max={100}
                    step={5}
                    onValueChange={(value) => setCustomization(prev => ({
                      ...prev, 
                      shelfOpacity: value[0] / 100
                    }))}
                    onValueCommit={saveCustomization}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          
          <div className="flex justify-between pt-2">
            <Button
              variant="outline"
              size="sm"
              className="text-xs h-8"
              onClick={resetCustomization}
            >
              <RefreshCw className="h-3.5 w-3.5 mr-1" /> Reset to Defaults
            </Button>
            
            <Button
              size="sm"
              className="text-xs h-8"
              onClick={saveCustomization}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default CustomizationPanel;
