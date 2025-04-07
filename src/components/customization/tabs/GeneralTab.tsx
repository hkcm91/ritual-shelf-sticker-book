
import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { useBookshelfStore } from "@/store/bookshelfStore";
import ColorPicker from "../ColorPicker";
import FileInputField from "../FileInputField";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Image, Trash2 } from "lucide-react";
import { toast } from "sonner";

const GeneralTab: React.FC = () => {
  const { 
    page, 
    updatePageBackground,
    updatePageBackgroundImage,
    updatePageSetting
  } = useBookshelfStore();

  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = (url: string) => {
    updatePageBackgroundImage(url);
    toast.success("Background image updated");
  };

  const handleRemoveImage = () => {
    updatePageBackgroundImage("");
    toast.success("Background image removed");
  };

  return (
    <div className="space-y-6">
      <div className="rounded-md border p-4 space-y-4">
        <h3 className="text-lg font-medium">Page Background</h3>
        <p className="text-sm text-muted-foreground">
          Customize the background of the entire page.
        </p>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Background Color</Label>
            <ColorPicker 
              color={page?.background || '#f5f5f5'} 
              onChange={updatePageBackground}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Background Image</Label>
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
          </div>

          {page?.backgroundImage && (
            <div className="space-y-4 pt-2 border-t">
              <div className="rounded-md border overflow-hidden h-32 bg-center bg-no-repeat" 
                style={{backgroundImage: `url(${page.backgroundImage})`, backgroundSize: page.backgroundSize || 'cover'}}>
              </div>
            
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
      </div>
    </div>
  );
};

export default GeneralTab;
