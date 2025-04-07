
import React, { useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { useBookshelfStore } from "@/store/bookshelfStore";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";

const ActionButtons: React.FC = () => {
  const { saveCustomization, resetCustomization } = useBookshelfStore();
  const [isSaving, setIsSaving] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  
  // Handle save with error protection
  const handleSave = useCallback(async () => {
    try {
      setIsSaving(true);
      await saveCustomization();
      toast.success("Customization saved successfully");
    } catch (error) {
      console.error("Error saving customization:", error);
      toast.error("Failed to save customization");
    } finally {
      setIsSaving(false);
    }
  }, [saveCustomization]);
  
  // Handle reset with error protection
  const handleReset = useCallback(async () => {
    try {
      setIsResetting(true);
      await resetCustomization();
      toast.success("Settings reset to defaults");
    } catch (error) {
      console.error("Error resetting customization:", error);
      toast.error("Failed to reset customization");
    } finally {
      setIsResetting(false);
    }
  }, [resetCustomization]);
  
  return (
    <div className="flex justify-between">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline" disabled={isResetting}>
            {isResetting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Resetting...
              </>
            ) : (
              "Reset to Defaults"
            )}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will reset all your customization settings to default values. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleReset}>Reset</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <Button onClick={handleSave} disabled={isSaving}>
        {isSaving ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          "Save Changes"
        )}
      </Button>
    </div>
  );
};

export default ActionButtons;
