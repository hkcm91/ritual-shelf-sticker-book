
import React from 'react';
import { Label } from "@/components/ui/label";
import { useBookshelfStore } from "@/store/bookshelfStore";
import ColorPicker from "../ColorPicker";
import FileInputField from "../FileInputField";

const GeneralTab: React.FC = () => {
  const { 
    page, 
    updatePageBackground,
    updatePageBackgroundImage
  } = useBookshelfStore();

  return (
    <div className="rounded-md border p-4 space-y-6">
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
            onChange={(url) => updatePageBackgroundImage(url)}
            placeholder="Enter image URL"
            uploadLabel="Upload Image"
          />
          <p className="text-xs text-muted-foreground">
            Image will be applied as background to the entire page
          </p>
        </div>
      </div>
    </div>
  );
};

export default GeneralTab;
