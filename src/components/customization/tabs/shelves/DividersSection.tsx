
import React from 'react';
import { useBookshelfStore } from "@/store/bookshelfStore";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import SimpleOrientationSelector from './SimpleOrientationSelector';
import { Slider } from "@/components/ui/slider";

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
                <p>Add subtle dividers that match your shelf styling to separate books on your shelf</p>
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
          
          <div className="space-y-3">
            <Label className="font-medium">Style</Label>
            <SimpleOrientationSelector 
              value={shelfStyling?.dividers?.orientation || 'vertical'} 
              onChange={(value) => updateDividersSetting('orientation', value)} 
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Spacing</Label>
              <span className="text-sm text-muted-foreground">
                {shelfStyling?.dividers?.booksPerSection || 4} books
              </span>
            </div>
            <Slider
              value={[shelfStyling?.dividers?.booksPerSection || 4]}
              min={2}
              max={6}
              step={1}
              onValueChange={(value) => updateDividersSetting('booksPerSection', value[0])}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Thickness</Label>
              <span className="text-sm text-muted-foreground">{shelfStyling?.dividers?.thickness || 6}px</span>
            </div>
            <Slider
              value={[shelfStyling?.dividers?.thickness || 6]}
              min={2}
              max={8}
              step={1}
              onValueChange={(value) => updateDividersSetting('thickness', value[0])}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="link-divider-color">Match shelf appearance</Label>
              <Switch 
                id="link-divider-color"
                checked={linkDividerStyling}
                onCheckedChange={setLinkDividerStyling}
              />
            </div>
            <p className="text-xs text-muted-foreground italic">
              When enabled, dividers will automatically match your shelf color and texture
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default DividersSection;
