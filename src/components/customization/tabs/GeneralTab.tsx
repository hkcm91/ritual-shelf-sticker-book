
import React from 'react';
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import ColorPicker from "@/components/customization/ColorPicker";
import FileInputField from "@/components/customization/FileInputField";
import { useBookshelfStore } from "@/store/bookshelfStore";
import ThemeSelector from '@/components/settings/ThemeSelector';

const GeneralTab: React.FC = () => {
  const { 
    page, 
    updatePageBackground, 
    updatePageBackgroundImage 
  } = useBookshelfStore();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Theme Selection</h3>
        <p className="text-sm text-muted-foreground">
          Choose a preset theme or customize individual elements below.
        </p>
        <div className="mt-4">
          <ThemeSelector />
        </div>
      </div>

      <Separator />
      
      <div>
        <h3 className="text-lg font-medium">Page Background</h3>
        <p className="text-sm text-muted-foreground">
          Customize the background of the entire page.
        </p>
        
        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label>Background Color</Label>
            <ColorPicker 
              color={page.background} 
              onChange={updatePageBackground}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Background Image</Label>
            <FileInputField
              value={page.backgroundImage}
              onChange={updatePageBackgroundImage}
              placeholder="Enter background image URL"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralTab;
