
import React from 'react';
import { useBookshelfStore } from "@/store/bookshelfStore";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Link, Link2Off, HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import ColorPicker from '../../ColorPicker';
import DividerControls from './DividerControls';

interface DividersSectionProps {
  linkDividerStyling: boolean;
  setLinkDividerStyling: (value: boolean) => void;
}

const DividersSection: React.FC<DividersSectionProps> = ({ 
  linkDividerStyling, 
  setLinkDividerStyling 
}) => {
  const { 
    shelfStyling, 
    toggleDividers,
    updateDividersSetting
  } = useBookshelfStore();
  
  // Handle divider color change with linked styling
  const handleDividerColorChange = (color: string) => {
    updateDividersSetting('color', color);
    
    // If divider styling is linked, update shelf color as well
    if (linkDividerStyling) {
      useBookshelfStore.getState().updateShelfColor(color);
    }
  };

  return (
    <div className="rounded-md border p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-lg">Dividers</h3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent side="right" className="max-w-[300px]">
                <p>Dividers help organize your bookshelf by separating sections both vertically and horizontally</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Switch 
          id="enable-dividers" 
          checked={shelfStyling?.dividers?.enabled || false}
          onCheckedChange={(checked) => toggleDividers(checked)}
        />
      </div>
      
      {shelfStyling?.dividers?.enabled && (
        <>
          <Separator className="my-2" />
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Label htmlFor="link-divider-styling" className="text-sm font-medium">Link Divider Styling</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-[300px]">
                    <p>When enabled, dividers will use the same color as shelves and update together</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="flex items-center gap-2">
              {linkDividerStyling ? (
                <Link className="h-4 w-4 text-primary" />
              ) : (
                <Link2Off className="h-4 w-4 text-muted-foreground" />
              )}
              <Switch 
                id="link-divider-styling"
                checked={linkDividerStyling}
                onCheckedChange={setLinkDividerStyling}
              />
            </div>
          </div>
          
          <DividerControls linkDividerStyling={linkDividerStyling} />
          
          {!linkDividerStyling && (
            <div className="space-y-2 pt-2 border-t border-dashed border-gray-200">
              <Label className="font-medium">Divider Color</Label>
              <div className="flex items-center gap-2">
                <ColorPicker 
                  color={shelfStyling?.dividers?.color || '#714621'} 
                  onChange={handleDividerColorChange} 
                />
                <span className="text-sm text-muted-foreground">{shelfStyling?.dividers?.color}</span>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DividersSection;
