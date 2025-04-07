
import React, { useCallback } from 'react';
import { useBookshelfStore } from "@/store/bookshelfStore";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { HelpCircle, AlertTriangle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import SimpleOrientationSelector from './SimpleOrientationSelector';
import { Slider } from "@/components/ui/slider";
import { toast } from 'sonner';
import { Alert, AlertDescription } from "@/components/ui/alert";

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
  
  // Safe handler for toggling dividers
  const handleToggleDividers = useCallback((checked: boolean) => {
    try {
      toggleDividers(checked);
      toast.success(checked ? 'Dividers enabled' : 'Dividers disabled');
    } catch (error) {
      console.error('Error toggling dividers:', error);
      toast.error('Failed to toggle dividers');
    }
  }, [toggleDividers]);
  
  // Safe handler for updating divider settings
  const handleUpdateDividerSetting = useCallback((property: 'orientation' | 'booksPerSection' | 'thickness', value: any) => {
    try {
      updateDividersSetting(property, value);
    } catch (error) {
      console.error(`Error updating divider ${property}:`, error);
      toast.error(`Failed to update divider ${property}`);
    }
  }, [updateDividersSetting]);
  
  // Check if shelf styling is available
  const hasDividerSettings = shelfStyling && shelfStyling.dividers;
  
  // If shelf styling is unavailable, show error message
  if (!shelfStyling) {
    return (
      <div className="rounded-md border p-4">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Shelf styling settings could not be loaded. Please refresh the page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  return (
    <div className="rounded-md border p-4 space-y-4 mt-6">
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
          checked={hasDividerSettings ? (shelfStyling.dividers.enabled || false) : false}
          onCheckedChange={handleToggleDividers}
        />
      </div>
      
      {hasDividerSettings && shelfStyling.dividers.enabled && (
        <>
          <Separator className="my-2" />
          
          <div className="space-y-6 pl-0.5">
            <div className="space-y-3">
              <h4 className="font-medium text-sm text-muted-foreground">Divider Style</h4>
              <SimpleOrientationSelector 
                value={shelfStyling.dividers.orientation || 'vertical'} 
                onChange={(value) => handleUpdateDividerSetting('orientation', value)} 
              />
            </div>
            
            <div className="space-y-5">
              <h4 className="font-medium text-sm text-muted-foreground">Divider Layout</h4>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Spacing</Label>
                  <span className="text-sm text-muted-foreground">
                    {shelfStyling.dividers.booksPerSection || 4} books
                  </span>
                </div>
                <Slider
                  value={[shelfStyling.dividers.booksPerSection || 4]}
                  min={2}
                  max={6}
                  step={1}
                  onValueChange={(value) => handleUpdateDividerSetting('booksPerSection', value[0])}
                />
                <p className="text-xs text-muted-foreground">
                  Number of book slots between dividers
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Thickness</Label>
                  <span className="text-sm text-muted-foreground">{shelfStyling.dividers.thickness || 6}px</span>
                </div>
                <Slider
                  value={[shelfStyling.dividers.thickness || 6]}
                  min={2}
                  max={8}
                  step={1}
                  onValueChange={(value) => handleUpdateDividerSetting('thickness', value[0])}
                />
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-muted/40 rounded-md">
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
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DividersSection;
