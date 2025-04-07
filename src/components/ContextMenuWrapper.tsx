
import React from 'react';
import { 
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubTrigger,
  ContextMenuSubContent
} from "@/components/ui/context-menu";
import { RotateCcw, RotateCw, RefreshCw, Trash2, Layers, ArrowUp, ArrowDown } from "lucide-react";

type ContextMenuWrapperProps = {
  children: React.ReactNode;
  book: any;
  handleRotate: (direction: 'cw' | 'ccw') => void;
  handleResetTransform: () => void;
  setShowDeleteDialog: (show: boolean) => void;
  handleZIndexChange?: (direction: 'up' | 'down') => void;
};

const ContextMenuWrapper: React.FC<ContextMenuWrapperProps> = ({
  children,
  book,
  handleRotate,
  handleResetTransform,
  setShowDeleteDialog,
  handleZIndexChange
}) => {
  if (!book?.isSticker) return <>{children}</>;
  
  return (
    <ContextMenu>
      <ContextMenuTrigger>
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent className="w-48">
        <ContextMenuItem onClick={() => handleRotate('ccw')}>
          <RotateCcw className="mr-2 h-4 w-4" />
          <span>Rotate Left</span>
        </ContextMenuItem>
        <ContextMenuItem onClick={() => handleRotate('cw')}>
          <RotateCw className="mr-2 h-4 w-4" />
          <span>Rotate Right</span>
        </ContextMenuItem>
        
        {handleZIndexChange && (
          <>
            <ContextMenuSeparator />
            <ContextMenuItem onClick={() => handleZIndexChange('up')}>
              <ArrowUp className="mr-2 h-4 w-4" />
              <span>Bring Forward</span>
            </ContextMenuItem>
            <ContextMenuItem onClick={() => handleZIndexChange('down')}>
              <ArrowDown className="mr-2 h-4 w-4" />
              <span>Send Backward</span>
            </ContextMenuItem>
          </>
        )}
        
        <ContextMenuSeparator />
        <ContextMenuItem onClick={handleResetTransform}>
          <RefreshCw className="mr-2 h-4 w-4" />
          <span>Reset</span>
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem onClick={() => setShowDeleteDialog(true)} className="text-red-500">
          <Trash2 className="mr-2 h-4 w-4" />
          <span>Delete</span>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default ContextMenuWrapper;
