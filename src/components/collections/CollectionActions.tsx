
import React from 'react';
import { PlusCircle, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBookshelfStore } from '../../store/bookshelfStore';

interface CollectionActionsProps {
  onCreateNew: () => void;
  onRename: () => void;
  className?: string;
}

const CollectionActions: React.FC<CollectionActionsProps> = ({
  onCreateNew,
  onRename,
  className = ''
}) => {
  const { activeShelfId, shelves } = useBookshelfStore();
  const currentShelf = activeShelfId ? shelves[activeShelfId] : null;
  
  return (
    <div className={`flex justify-between gap-2 ${className}`}>
      <Button
        variant="ghost"
        onClick={onRename}
        disabled={!currentShelf}
        className="game-btn flex-1 text-xs h-8 from-amber-900/40 to-amber-950/40 hover:from-amber-900/50 hover:to-amber-950/50"
      >
        <Edit2 className="h-3.5 w-3.5 mr-1" />
        <span>Rename</span>
      </Button>

      <Button
        variant="ghost"
        onClick={onCreateNew}
        className="game-btn flex-1 text-xs h-8 from-amber-900/40 to-amber-950/40 hover:from-amber-900/50 hover:to-amber-950/50"
      >
        <PlusCircle className="h-3.5 w-3.5 mr-1" />
        <span>Create New</span>
      </Button>
    </div>
  );
};

export default CollectionActions;
