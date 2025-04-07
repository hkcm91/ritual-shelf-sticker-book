
import React from 'react';
import { Label } from "@/components/ui/label";
import { useBookshelfStore } from "@/store/bookshelfStore";
import ColorPicker from '../ColorPicker';
import FileInputField from '../FileInputField';

const GeneralTab: React.FC = () => {
  const { page, updatePageBackground, updatePageBackgroundImage } = useBookshelfStore();

  return (
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
        <FileInputField
          value={page.backgroundImage}
          onChange={updatePageBackgroundImage}
          placeholder="Enter image URL"
          uploadLabel="Upload Image"
        />
      </div>
    </div>
  );
};

export default GeneralTab;
