
import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useBookshelfStore } from "@/store/bookshelfStore";
import ColorPicker from '../ColorPicker';
import FileInputField from '../FileInputField';
import ColorChart from '../ColorChart';
import { toast } from 'sonner';

const HeaderTab: React.FC = () => {
  const { header, updateHeaderSetting } = useBookshelfStore();
  const [showColorChart, setShowColorChart] = useState(false);

  const handleColorSelect = (color: string) => {
    updateHeaderSetting('background', color);
    toast.success("Header background color updated");
  };

  return (
    <div className="rounded-md border p-4 space-y-4">
      <h3 className="font-medium text-lg">Header Appearance</h3>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label>Background Color</Label>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowColorChart(!showColorChart)}
            className="h-7 text-xs"
          >
            {showColorChart ? "Hide Color Chart" : "Show Color Chart"}
          </Button>
        </div>
        <ColorPicker 
          color={header.background} 
          onChange={(color) => updateHeaderSetting('background', color)}
          allowAlpha={true}
        />
        
        {showColorChart && (
          <div className="rounded-lg border p-3 mt-2 bg-background">
            <ColorChart
              baseColor={header.background.startsWith('rgba') 
                ? header.background.replace(/rgba\((\d+),\s*(\d+),\s*(\d+).*/, 'rgb($1,$2,$3)')
                : header.background}
              onSelectColor={handleColorSelect}
            />
          </div>
        )}
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
      
      {/* Preview section */}
      <div className="pt-3 border-t mt-3">
        <Label className="text-sm mb-2">Preview</Label>
        <div 
          className="h-12 rounded-md flex items-center px-4"
          style={{
            backgroundColor: header.background,
            backgroundImage: header.backgroundImage ? `url(${header.backgroundImage})` : 'none',
            color: header.textColor,
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}
        >
          <span className="font-medium">Sample Header Text</span>
        </div>
      </div>
    </div>
  );
};

export default HeaderTab;
