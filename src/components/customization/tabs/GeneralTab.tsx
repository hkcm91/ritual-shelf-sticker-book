import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { useBookshelfStore } from "@/store/bookshelfStore";
import ColorPicker from "../ColorPicker";
import FileInputField from "../FileInputField";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Paintbrush, Image, Trash2, ChevronUp, ChevronDown, Palette } from "lucide-react";
import { toast } from "sonner";
import ColorChart from "../ColorChart";

const GeneralTab: React.FC = () => {
  const { 
    page, 
    updatePageBackground,
    updatePageBackgroundImage,
    updatePageSetting
  } = useBookshelfStore();

  const [isUploading, setIsUploading] = useState(false);
  const [showColorChart, setShowColorChart] = useState(false);
  const [collapseSection, setCollapseSection] = useState<Record<string, boolean>>({
    backgroundColor: false,
    backgroundImage: false,
    backgroundSettings: true
  });

  const handleImageUpload = (url: string) => {
    updatePageBackgroundImage(url);
    toast.success("Background image updated");
  };

  const handleRemoveImage = () => {
    updatePageBackgroundImage("");
    toast.success("Background image removed");
  };

  const handleColorSelect = (color: string) => {
    updatePageBackground(color);
    toast.success("Background color updated");
  };

  const toggleSection = (section: string) => {
    setCollapseSection(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="space-y-6 max-h-[80vh] overflow-y-auto pr-1">
      <div className="rounded-md border p-4 space-y-4">
        <h3 className="text-lg font-medium">Page Background</h3>
        <p className="text-sm text-muted-foreground">
          Customize the background of the entire page.
        </p>
        
        {/* Background Color Section */}
        <div className="space-y-2 border-b pb-4">
          <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleSection('backgroundColor')}>
            <div className="flex items-center gap-2">
              <Paintbrush className="h-4 w-4 text-muted-foreground" />
              <Label className="cursor-pointer">Background Color</Label>
            </div>
            <div className="flex items-center gap-2">
              <div 
                className="h-5 w-5 rounded-full border"
                style={{ backgroundColor: page?.background || '#f5f5f5' }}
              />
              <Button 
                variant="ghost" 
                size="icon"
                className="h-7 w-7"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSection('backgroundColor');
                }}
              >
                {collapseSection.backgroundColor ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          
          {!collapseSection.backgroundColor && (
            <div className="mt-2 pl-6 space-y-3">
              <ColorPicker 
                color={page?.background || '#f5f5f5'} 
                onChange={updatePageBackground}
              />
              
              <div className="flex justify-between items-center">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowColorChart(!showColorChart)}
                  className="h-7 text-xs"
                >
                  {showColorChart ? "Hide Color Chart" : "Show Color Chart"}
                </Button>
              </div>
              
              {showColorChart && (
                <div className="rounded-lg border p-3 mt-2 bg-background">
                  <ColorChart
                    baseColor={page?.background || '#f5f5f5'}
                    onSelectColor={handleColorSelect}
                  />
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Background Image Section */}
        <div className="space-y-2 border-b pb-4">
          <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleSection('backgroundImage')}>
            <div className="flex items-center gap-2">
              <Image className="h-4 w-4 text-muted-foreground" />
              <Label className="cursor-pointer">Background Image</Label>
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              className="h-7 w-7"
              onClick={(e) => {
                e.stopPropagation();
                toggleSection('backgroundImage');
              }}
            >
              {collapseSection.backgroundImage ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
            </Button>
          </div>
          
          {!collapseSection.backgroundImage && (
            <div className="mt-2 pl-6 space-y-3">
              <FileInputField
                value={page?.backgroundImage || ''} 
                onChange={handleImageUpload}
                placeholder="Enter image URL"
                uploadLabel="Upload Image"
                isLoading={isUploading}
                setIsLoading={setIsUploading}
                accept="image/*"
              />
              
              <div className="flex justify-between items-center">
                <p className="text-xs text-muted-foreground">
                  Image will be applied as background to the entire page
                </p>
                {page?.backgroundImage && (
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={handleRemoveImage}
                    className="h-7 text-xs"
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Remove
                  </Button>
                )}
              </div>
              
              {page?.backgroundImage && (
                <div className="rounded-md border overflow-hidden h-32 bg-center bg-no-repeat mt-2" 
                  style={{backgroundImage: `url(${page.backgroundImage})`, backgroundSize: page.backgroundSize || 'cover'}}>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Background Settings Section (only visible when image is present) */}
        {page?.backgroundImage && (
          <div className="space-y-2 pt-2">
            <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleSection('backgroundSettings')}>
              <div className="flex items-center gap-2">
                <Palette className="h-4 w-4 text-muted-foreground" />
                <Label className="cursor-pointer">Background Settings</Label>
              </div>
              <Button 
                variant="ghost" 
                size="icon"
                className="h-7 w-7"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSection('backgroundSettings');
                }}
              >
                {collapseSection.backgroundSettings ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
              </Button>
            </div>
            
            {!collapseSection.backgroundSettings && (
              <div className="mt-2 pl-6 space-y-4">
                <div className="space-y-2">
                  <Label>Background Size</Label>
                  <Select 
                    value={page?.backgroundSize || 'cover'} 
                    onValueChange={(value) => updatePageSetting('backgroundSize', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cover">Cover (fill screen)</SelectItem>
                      <SelectItem value="contain">Contain (show full image)</SelectItem>
                      <SelectItem value="auto">Auto (original size)</SelectItem>
                      <SelectItem value="100% 100%">Stretch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Background Repeat</Label>
                  <Select 
                    value={page?.backgroundRepeat || 'no-repeat'} 
                    onValueChange={(value) => updatePageSetting('backgroundRepeat', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select repeat pattern" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="no-repeat">No Repeat</SelectItem>
                      <SelectItem value="repeat">Repeat</SelectItem>
                      <SelectItem value="repeat-x">Repeat Horizontally</SelectItem>
                      <SelectItem value="repeat-y">Repeat Vertically</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Background Position</Label>
                  <Select 
                    value={page?.backgroundPosition || 'center'} 
                    onValueChange={(value) => updatePageSetting('backgroundPosition', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select position" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="center">Center</SelectItem>
                      <SelectItem value="top">Top</SelectItem>
                      <SelectItem value="bottom">Bottom</SelectItem>
                      <SelectItem value="left">Left</SelectItem>
                      <SelectItem value="right">Right</SelectItem>
                      <SelectItem value="top left">Top Left</SelectItem>
                      <SelectItem value="top right">Top Right</SelectItem>
                      <SelectItem value="bottom left">Bottom Left</SelectItem>
                      <SelectItem value="bottom right">Bottom Right</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="fixed-bg"
                    checked={page?.backgroundAttachment === 'fixed'}
                    onCheckedChange={(checked) => 
                      updatePageSetting('backgroundAttachment', checked ? 'fixed' : 'scroll')
                    }
                  />
                  <Label htmlFor="fixed-bg">Fixed Background (doesn't scroll)</Label>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GeneralTab;
