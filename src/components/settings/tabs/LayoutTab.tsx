
import React, { useEffect } from 'react';
import { useBookshelfStore } from '@/store/bookshelfStore';
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import RowControls from './layout/RowControls';
import ColumnControls from './layout/ColumnControls';
import VerticalDividersControl from './layout/VerticalDividersControl';

const LayoutTab: React.FC = () => {
  const {
    activeShelfId,
    shelves,
    initializeDefaultShelf
  } = useBookshelfStore();
  
  // Ensure we have a default shelf
  useEffect(() => {
    // If there are no shelves or the active shelf is missing, initialize a default shelf
    if (!activeShelfId || !shelves || Object.keys(shelves).length === 0) {
      initializeDefaultShelf();
    }
  }, [shelves, activeShelfId, initializeDefaultShelf]);

  return (
    <div className="space-y-6">
      <Card className="bg-amber-950/20 border border-amber-700/30">
        <CardContent className="pt-6 space-y-6">
          <h3 className="text-lg font-semibold text-amber-300 mb-4">Shelf Layout</h3>
          
          <RowControls />
          
          <ColumnControls />
          
          <Separator className="my-4 bg-amber-700/30" />
          
          <VerticalDividersControl />
        </CardContent>
      </Card>
      
      <div className="text-sm text-amber-200/70 p-3 bg-amber-900/20 rounded-lg border border-amber-800/20">
        These settings control the general layout of your bookshelf.
        Changes will apply to the current active library.
      </div>
    </div>
  );
};

export default LayoutTab;
