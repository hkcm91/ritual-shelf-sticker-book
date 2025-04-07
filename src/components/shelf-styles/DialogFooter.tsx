
import React from 'react';
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface StylesDialogFooterProps {
  handleReset: () => void;
  handleApply: () => void;
}

const StylesDialogFooter: React.FC<StylesDialogFooterProps> = ({
  handleReset,
  handleApply
}) => {
  return (
    <DialogFooter className="flex justify-between sm:justify-between">
      <Button
        type="button"
        variant="outline"
        onClick={handleReset}
      >
        <RefreshCw className="mr-2 h-4 w-4" />
        Reset to Default
      </Button>
      <Button type="button" onClick={handleApply}>
        Apply Changes
      </Button>
    </DialogFooter>
  );
};

export default StylesDialogFooter;
