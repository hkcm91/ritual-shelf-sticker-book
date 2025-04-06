
import React, { useState, useEffect } from 'react';
import { useBookshelfStore } from '../store/bookshelfStore';
import BookSlot from './BookSlot';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Palette, 
  Settings, 
  RefreshCw,
  ChevronDown,
  ChevronUp
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

type CustomizationState = {
  containerBgImage: string;
  containerBgColor: string;
  containerOpacity: number;
  shelfBgImage: string;
  shelfBgColor: string;
  shelfOpacity: number;
  isCustomizationOpen: boolean;
};

const BookshelfGrid: React.FC = () => {
  const { activeShelfId, shelves, zoomLevel } = useBookshelfStore();
  const activeShelf = shelves[activeShelfId];
  
  // Customization state
  const [customization, setCustomization] = useState<CustomizationState>({
    containerBgImage: '',
    containerBgColor: '#a47148',
    containerOpacity: 1,
    shelfBgImage: '',
    shelfBgColor: '#8B5A2B',
    shelfOpacity: 1,
    isCustomizationOpen: false
  });
  
  // Load customization from localStorage
  useEffect(() => {
    try {
      const savedContainerBgImage = localStorage.getItem(`bookshelf-container-bg-image-${activeShelfId}`);
      const savedContainerBgColor = localStorage.getItem(`bookshelf-container-bg-color-${activeShelfId}`);
      const savedContainerOpacity = localStorage.getItem(`bookshelf-container-opacity-${activeShelfId}`);
      const savedShelfBgImage = localStorage.getItem(`bookshelf-shelf-bg-image-${activeShelfId}`);
      const savedShelfBgColor = localStorage.getItem(`bookshelf-shelf-bg-color-${activeShelfId}`);
      const savedShelfOpacity = localStorage.getItem(`bookshelf-shelf-opacity-${activeShelfId}`);
      
      setCustomization(prev => ({
        ...prev,
        containerBgImage: savedContainerBgImage || '',
        containerBgColor: savedContainerBgColor || '#a47148',
        containerOpacity: savedContainerOpacity ? parseFloat(savedContainerOpacity) : 1,
        shelfBgImage: savedShelfBgImage || '',
        shelfBgColor: savedShelfBgColor || '#8B5A2B',
        shelfOpacity: savedShelfOpacity ? parseFloat(savedShelfOpacity) : 1
      }));
    } catch (error) {
      console.error('Error loading customization:', error);
    }
  }, [activeShelfId]);
  
  // Save customization to localStorage
  const saveCustomization = () => {
    try {
      // Container customization
      if (customization.containerBgImage) {
        try {
          localStorage.setItem(`bookshelf-container-bg-image-${activeShelfId}`, customization.containerBgImage);
        } catch (e) {
          console.error('Failed to save container background image:', e);
          toast.error('Background image too large to save. Try using a URL instead.');
        }
      }
      
      localStorage.setItem(`bookshelf-container-bg-color-${activeShelfId}`, customization.containerBgColor);
      localStorage.setItem(`bookshelf-container-opacity-${activeShelfId}`, customization.containerOpacity.toString());
      
      // Shelf customization
      if (customization.shelfBgImage) {
        try {
          localStorage.setItem(`bookshelf-shelf-bg-image-${activeShelfId}`, customization.shelfBgImage);
        } catch (e) {
          console.error('Failed to save shelf background image:', e);
          toast.error('Shelf texture image too large to save. Try using a URL instead.');
        }
      }
      
      localStorage.setItem(`bookshelf-shelf-bg-color-${activeShelfId}`, customization.shelfBgColor);
      localStorage.setItem(`bookshelf-shelf-opacity-${activeShelfId}`, customization.shelfOpacity.toString());
      
      toast.success('Customization saved');
    } catch (error) {
      console.error('Error saving customization:', error);
      toast.error('Failed to save customization');
    }
  };
  
  // Reset customization
  const resetCustomization = () => {
    setCustomization({
      containerBgImage: '',
      containerBgColor: '#a47148',
      containerOpacity: 1,
      shelfBgImage: '',
      shelfBgColor: '#8B5A2B',
      shelfOpacity: 1,
      isCustomizationOpen: true
    });
    
    // Remove from localStorage
    localStorage.removeItem(`bookshelf-container-bg-image-${activeShelfId}`);
    localStorage.removeItem(`bookshelf-container-bg-color-${activeShelfId}`);
    localStorage.removeItem(`bookshelf-container-opacity-${activeShelfId}`);
    localStorage.removeItem(`bookshelf-shelf-bg-image-${activeShelfId}`);
    localStorage.removeItem(`bookshelf-shelf-bg-color-${activeShelfId}`);
    localStorage.removeItem(`bookshelf-shelf-opacity-${activeShelfId}`);
    
    toast.success('Customization reset to defaults');
  };
  
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    target: 'container' | 'shelf'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (typeof event.target?.result === 'string') {
          try {
            const result = event.target.result;
            if (target === 'container') {
              setCustomization(prev => ({...prev, containerBgImage: result}));
            } else {
              setCustomization(prev => ({...prev, shelfBgImage: result}));
            }
            saveCustomization();
          } catch (error) {
            console.error('Error handling image:', error);
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
  
  const handleImageUrl = (url: string, target: 'container' | 'shelf') => {
    if (!url) return;
    
    try {
      if (target === 'container') {
        setCustomization(prev => ({...prev, containerBgImage: url}));
      } else {
        setCustomization(prev => ({...prev, shelfBgImage: url}));
      }
      saveCustomization();
    } catch (error) {
      console.error('Error setting image URL:', error);
      toast.error('Failed to set image URL');
    }
  };
  
  if (!activeShelf) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-lg text-gray-500">
          No shelf selected. Create a new shelf to get started.
        </p>
      </div>
    );
  }
  
  const { rows, columns } = activeShelf;
  
  // Generate grid cells
  const renderGrid = () => {
    const grid = [];
    
    for (let row = 0; row < rows; row++) {
      // First add the book slots for this row
      const slots = [];
      for (let col = 0; col < columns; col++) {
        const position = row * columns + col;
        slots.push(
          <BookSlot key={`slot-${row}-${col}`} position={position} />
        );
      }
      
      grid.push(
        <div key={`row-${row}`} className="flex flex-col mb-8">
          <div className="flex justify-center space-x-2">
            {slots}
          </div>
          <div 
            className="wood-shelf h-10 bg-repeat-x bg-bottom bg-contain" 
            style={{ 
              marginLeft: '-8px',
              marginRight: '-8px',
              backgroundColor: customization.shelfBgColor,
              opacity: customization.shelfOpacity,
              backgroundImage: customization.shelfBgImage ? 
                `url(${customization.shelfBgImage})` : 
                'url(/lovable-uploads/1VjId2_iqK82YNtwIi1V4ckXnQEu6jhM3.png)'
            }}
          />
        </div>
      );
    }
    
    return grid;
  };
  
  // Customization panel
  const renderCustomizationPanel = () => {
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
  
  return (
    <div 
      className="bookshelf-wrapper p-4 md:p-8 overflow-auto max-w-full w-full"
    >
      <div 
        className="bookshelf-container relative flex flex-col items-center rounded-md p-6 shadow-lg max-w-full mx-auto transform-gpu"
        style={{ 
          transform: `scale(${zoomLevel})`,
          transformOrigin: 'top center',
          width: 'max-content',
          backgroundColor: customization.containerBgColor,
          opacity: customization.containerOpacity,
          backgroundImage: customization.containerBgImage ? 
            `url(${customization.containerBgImage})` : 
            'url(/lovable-uploads/b613332c-c1a6-46ce-bd9f-6643f75a811a.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {renderCustomizationPanel()}
        {renderGrid()}
      </div>
    </div>
  );
};

export default BookshelfGrid;
