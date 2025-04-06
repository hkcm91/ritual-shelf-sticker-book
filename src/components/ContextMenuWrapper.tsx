
import React from 'react';
import { 
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator
} from "@/components/ui/context-menu";
import { RotateCcw, RotateCw, RefreshCw, Trash2 } from "lucide-react";

type ContextMenuWrapperProps = {
  children: React.ReactNode;
  book: any;
  handleRotate: (direction: 'cw' | 'ccw') => void;
  handleResetTransform: () => void;
  setShowDeleteDialog: (show: boolean) => void;
};

const ContextMenuWrapper: React.FC<ContextMenuWrapperProps> = ({
  children,
  book,
  handleRotate,
  handleResetTransform,
  setShowDeleteDialog
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
