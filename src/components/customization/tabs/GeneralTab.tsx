
import React from 'react';
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import ColorPicker from "@/components/customization/ColorPicker";
import { useBookshelfStore } from "@/store/bookshelfStore";
import ThemeSelector from '@/components/settings/ThemeSelector';

const GeneralTab: React.FC = () => {
  const { 
    page, 
    updatePageBackground
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
          Customize the background color of the entire page.
        </p>
        
        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label>Background Color</Label>
            <ColorPicker 
              color={page?.background || '#f5f5f5'} 
              onChange={updatePageBackground}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralTab;
