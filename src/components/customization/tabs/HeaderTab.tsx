
import React from 'react';
import { Label } from "@/components/ui/label";
import { useBookshelfStore } from "@/store/bookshelfStore";
import ColorPicker from '../ColorPicker';
import FileInputField from '../FileInputField';

const HeaderTab: React.FC = () => {
  const { header, updateHeaderSetting } = useBookshelfStore();

  return (
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
        <FileInputField
          value={header.backgroundImage}
          onChange={(url) => updateHeaderSetting('backgroundImage', url)}
          placeholder="Enter image URL"
          uploadLabel="Upload Image"
        />
      </div>
      
      <div className="space-y-2">
        <Label>Text Color</Label>
        <ColorPicker 
          color={header.textColor} 
          onChange={(color) => updateHeaderSetting('textColor', color)} 
        />
      </div>
    </div>
  );
};

export default HeaderTab;
