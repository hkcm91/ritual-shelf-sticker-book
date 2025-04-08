
import React from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PopupWindow } from '@/components/ui/popup-window';
import { ShelfData } from '@/store/types';

interface LibraryDeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  currentLibrary: ShelfData | null;
  onDelete: () => void;
}

export const LibraryDeleteDialog: React.FC<LibraryDeleteDialogProps> = ({
  isOpen,
  onClose,
  currentLibrary,
  onDelete
}) => {
  return (
    <PopupWindow
      isOpen={isOpen}
      onClose={onClose}
      title={
        <>
          <Trash2 className="h-5 w-5 text-red-300" />
          <span>Delete Library</span>
        </>
      }
      size="sm"
      footer={
        <>
          <Button 
            variant="outline" 
            onClick={onClose}
            className="border-amber-700/30 text-amber-200 hover:bg-amber-950/30 transition-all duration-300"
          >
            Cancel
          </Button>
          <Button 
            onClick={onDelete}
            className="bg-gradient-to-b from-red-600 to-red-800 text-white hover:from-red-500 hover:to-red-700 transition-all duration-300 hover:shadow-lg"
          >
            Delete Library
          </Button>
        </>
      }
    >
      <div className="space-y-4 p-4">
        <div className="p-4 bg-red-950/20 border border-red-800/30 rounded-lg">
          <p className="text-amber-100">
            Are you sure you want to delete <span className="font-bold">"{currentLibrary?.name}"</span>?
          </p>
          <p className="text-red-300 mt-2 text-sm">
            This action cannot be undone and all items in this library will be permanently removed.
          </p>
        </div>
      </div>
    </PopupWindow>
  );
};
