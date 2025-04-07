
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
  
  const shelvesData = shelves || {};
  const activeShelf = activeShelfId ? shelvesData[activeShelfId] : null;
  
  const handleAddColumn = () => {
    console.log("Add column clicked, activeShelfId:", activeShelfId);
    if (activeShelfId) {
      addColumn();
      toast.success("Column added successfully");
    } else {
      toast.error("No active shelf selected");
    }
  };
  
  const handleRemoveColumn = () => {
    console.log("Remove column clicked, activeShelfId:", activeShelfId);
    if (activeShelfId && activeShelf && activeShelf.columns > 1) {
      removeColumn();
      toast.success("Column removed successfully");
    } else {
      toast.error("Cannot remove the last column");
    }
  };

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-primary">Shelf Columns</h3>
      <p className="text-xs text-muted-foreground mb-2">
        Add or remove vertical columns of book slots on your bookshelf
      </p>
      <div className="flex items-center space-x-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRemoveColumn}
          disabled={!activeShelf || activeShelf.columns <= 1}
          className="px-2"
          aria-label="Remove column"
        >
          -
        </Button>
        <div className="flex items-center space-x-1">
          <Columns className="h-4 w-4 text-primary" />
          <span className="font-medium">{activeShelf ? activeShelf.columns : 0} Columns</span>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleAddColumn}
          className="px-2"
          aria-label="Add column"
        >
          +
        </Button>
      </div>
    </div>
  );
};

export default ColumnControls;
