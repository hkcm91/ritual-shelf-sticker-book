
import React from 'react';
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RefreshCw, Paintbrush } from "lucide-react";

interface StylesDialogFooterProps {
  handleReset: () => void;
  handleApply: () => void;
  isLoading?: boolean;
}

const StylesDialogFooter: React.FC<StylesDialogFooterProps> = ({
  handleReset,
  handleApply,
  isLoading = false
}) => {
  return (
    <DialogFooter className="flex justify-between sm:justify-between border-t mt-4 pt-4">
      <Button
        type="button"
        variant="outline"
        onClick={handleReset}
        disabled={isLoading}
      >
        <RefreshCw className="mr-2 h-4 w-4" />
        Reset to Default
      </Button>
      <Button 
        type="button" 
        onClick={handleApply}
        disabled={isLoading}
      >
        <Paintbrush className="mr-2 h-4 w-4" />
        Apply Changes
      </Button>
    </DialogFooter>
  );
};

export default StylesDialogFooter;
