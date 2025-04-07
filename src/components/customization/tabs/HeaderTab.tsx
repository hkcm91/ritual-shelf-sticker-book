
import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useBookshelfStore } from "@/store/bookshelfStore";
import ColorPicker from '../ColorPicker';
import FileInputField from '../FileInputField';
import ColorChart from '../ColorChart';
import { toast } from 'sonner';
import { Paintbrush, Image, ChevronUp, ChevronDown } from 'lucide-react';

const HeaderTab: React.FC = () => {
  const { header, updateHeaderSetting } = useBookshelfStore();
  const [showColorChart, setShowColorChart] = useState(false);
  const [collapseSection, setCollapseSection] = useState<Record<string, boolean>>({
    background: false,
    backgroundImage: false,
    textColor: false,
    preview: false
  });

  const handleColorSelect = (color: string) => {
    updateHeaderSetting('background', color);
    toast.success("Header background color updated");
  };
  
  const toggleSection = (section: string) => {
    setCollapseSection(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="rounded-md border p-4 space-y-4 max-h-[80vh] overflow-y-auto">
      <h3 className="font-medium text-lg">Header Appearance</h3>
      
      {/* Background Color Section */}
      <div className="space-y-2 border-b pb-4">
        <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleSection('background')}>
          <div className="flex items-center gap-2">
            <Paintbrush className="h-4 w-4 text-muted-foreground" />
            <Label className="cursor-pointer">Background Color</Label>
          </div>
          <div className="flex items-center gap-2">
            <div 
              className="h-5 w-5 rounded-full border"
              style={{ backgroundColor: header.background }}
            />
            <Button 
              variant="ghost" 
              size="icon"
              className="h-7 w-7"
              onClick={(e) => {
                e.stopPropagation();
                toggleSection('background');
              }}
            >
              {collapseSection.background ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        
        {!collapseSection.background && (
          <div className="mt-2 pl-6 space-y-3">
            <ColorPicker 
              color={header.background} 
              onChange={(color) => updateHeaderSetting('background', color)}
              allowAlpha={true}
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
                  baseColor={header.background.startsWith('rgba') 
                    ? header.background.replace(/rgba\((\d+),\s*(\d+),\s*(\d+).*/, 'rgb($1,$2,$3)')
                    : header.background}
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
          <div className="mt-2 pl-6">
            <FileInputField
              value={header.backgroundImage}
              onChange={(url) => updateHeaderSetting('backgroundImage', url)}
              placeholder="Enter image URL"
              uploadLabel="Upload Image"
            />
            
            {header.backgroundImage && (
              <div className="mt-2 p-2 border rounded-md">
                <img 
                  src={header.backgroundImage} 
                  alt="Header background" 
                  className="h-12 w-full object-cover rounded-md"
                />
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Text Color Section */}
      <div className="space-y-2 border-b pb-4">
        <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleSection('textColor')}>
          <div className="flex items-center gap-2">
            <Paintbrush className="h-4 w-4 text-muted-foreground" />
            <Label className="cursor-pointer">Text Color</Label>
          </div>
          <div className="flex items-center gap-2">
            <div 
              className="h-5 w-5 rounded-full border"
              style={{ backgroundColor: header.textColor }}
            />
            <Button 
              variant="ghost" 
              size="icon"
              className="h-7 w-7"
              onClick={(e) => {
                e.stopPropagation();
                toggleSection('textColor');
              }}
            >
              {collapseSection.textColor ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        
        {!collapseSection.textColor && (
          <div className="mt-2 pl-6">
            <ColorPicker 
              color={header.textColor} 
              onChange={(color) => updateHeaderSetting('textColor', color)} 
            />
          </div>
        )}
      </div>
      
      {/* Preview Section */}
      <div className="pt-2">
        <div className="flex justify-between items-center cursor-pointer mb-2" onClick={() => toggleSection('preview')}>
          <Label className="cursor-pointer">Preview</Label>
          <Button 
            variant="ghost" 
            size="icon"
            className="h-7 w-7"
            onClick={(e) => {
              e.stopPropagation();
              toggleSection('preview');
            }}
          >
            {collapseSection.preview ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
          </Button>
        </div>
        
        {!collapseSection.preview && (
          <div 
            className="h-12 rounded-md flex items-center px-4 transition-all"
            style={{
              backgroundColor: header.background,
              backgroundImage: header.backgroundImage ? `url(${header.backgroundImage})` : 'none',
              color: header.textColor,
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}
          >
            <span className="font-medium">Sample Header Text</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default HeaderTab;
