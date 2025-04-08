
import React from 'react';
import { Button } from "@/components/ui/button";
import { Columns } from 'lucide-react';
import { useBookshelfStore } from '@/store/bookshelfStore';
import { toast } from 'sonner';

const ColumnControls: React.FC = () => {
  const {
    addColumn,
    removeColumn,
    activeShelfId,
    shelves,
  } = useBookshelfStore();
  
  const activeShelf = activeShelfId ? shelves[activeShelfId] : null;
  
  const handleAddColumn = () => {
    if (activeShelfId) {
      console.log("Adding column for shelf:", activeShelfId);
      addColumn();
      toast.success("Column added successfully");
    } else {
      toast.error("No active shelf selected");
    }
  };
  
  const handleRemoveColumn = () => {
    if (activeShelfId && activeShelf && activeShelf.columns > 1) {
      console.log("Removing column for shelf:", activeShelfId);
      removeColumn();
      toast.success("Column removed successfully");
    } else {
      toast.error("Cannot remove the last column");
    }
  };

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-amber-200 flex items-center gap-2">
        <Columns className="h-4 w-4 text-amber-300" />
        Shelf Columns
      </h3>
      <p className="text-xs text-amber-200/70 mb-2">
        Add or remove vertical columns of book slots on your bookshelf
      </p>
      <div className="flex items-center space-x-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRemoveColumn}
          disabled={!activeShelf || activeShelf.columns <= 1}
          className="px-2 bg-amber-900/30 border-amber-700/30 text-amber-100 hover:bg-amber-800/40 hover:text-amber-50"
          aria-label="Remove column"
        >
          -
        </Button>
        <div className="flex items-center gap-2 px-4 py-2 rounded-md bg-amber-950/30 border border-amber-700/20">
          <span className="font-medium text-amber-100">{activeShelf ? activeShelf.columns : 0} Columns</span>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleAddColumn}
          className="px-2 bg-amber-900/30 border-amber-700/30 text-amber-100 hover:bg-amber-800/40 hover:text-amber-50"
          aria-label="Add column"
        >
          +
        </Button>
      </div>
    </div>
  );
};

export default ColumnControls;
