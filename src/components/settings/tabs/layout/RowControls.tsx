
import React from 'react';
import { Button } from "@/components/ui/button";
import { Rows3 } from 'lucide-react';
import { useBookshelfStore } from '@/store/bookshelfStore';
import { toast } from 'sonner';

const RowControls: React.FC = () => {
  const {
    addRow,
    removeRow,
    activeShelfId,
    shelves,
  } = useBookshelfStore();
  
  const activeShelf = activeShelfId ? shelves[activeShelfId] : null;
  
  const handleAddRow = () => {
    if (activeShelfId) {
      console.log("Adding row for shelf:", activeShelfId);
      addRow();
      toast.success("Row added successfully");
    } else {
      toast.error("No active shelf selected");
    }
  };
  
  const handleRemoveRow = () => {
    if (activeShelfId && activeShelf && activeShelf.rows > 1) {
      console.log("Removing row for shelf:", activeShelfId);
      removeRow();
      toast.success("Row removed successfully");
    } else {
      toast.error("Cannot remove the last row");
    }
  };

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-amber-200 flex items-center gap-2">
        <Rows3 className="h-4 w-4 text-amber-300" />
        Shelf Rows
      </h3>
      <p className="text-xs text-amber-200/70 mb-2">
        Add or remove horizontal rows of book slots on your bookshelf
      </p>
      <div className="flex items-center space-x-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRemoveRow}
          disabled={!activeShelf || activeShelf.rows <= 1}
          className="px-2 bg-amber-900/30 border-amber-700/30 text-amber-100 hover:bg-amber-800/40 hover:text-amber-50"
          aria-label="Remove row"
        >
          -
        </Button>
        <div className="flex items-center gap-2 px-4 py-2 rounded-md bg-amber-950/30 border border-amber-700/20">
          <span className="font-medium text-amber-100">{activeShelf ? activeShelf.rows : 0} Rows</span>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleAddRow}
          className="px-2 bg-amber-900/30 border-amber-700/30 text-amber-100 hover:bg-amber-800/40 hover:text-amber-50"
          aria-label="Add row"
        >
          +
        </Button>
      </div>
    </div>
  );
};

export default RowControls;
