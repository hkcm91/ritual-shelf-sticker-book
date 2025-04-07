
import React, { useCallback } from 'react';
import { useBookshelfStore } from "@/store/bookshelfStore";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { HelpCircle, AlertTriangle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from 'sonner';
import { Alert, AlertDescription } from "@/components/ui/alert";
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
    toggleDividers
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
            <DividerControls 
              linkDividerStyling={linkDividerStyling}
              setLinkDividerStyling={setLinkDividerStyling}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default DividersSection;
