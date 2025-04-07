
import React, { useEffect } from 'react';
import { useBookshelfStore } from '@/store/bookshelfStore';
import { Separator } from "@/components/ui/separator";
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
    console.log("Current shelves:", shelves);
    console.log("Current activeShelfId:", activeShelfId);
    
    // If there are no shelves or the active shelf is missing, initialize a default shelf
    if (!activeShelfId || !shelves || Object.keys(shelves).length === 0) {
      console.log("Initializing default shelf...");
      const shelfId = initializeDefaultShelf();
      console.log("Created default shelf with ID:", shelfId);
    }
  }, [shelves, activeShelfId, initializeDefaultShelf]);

  console.log("LayoutTab rendering, activeShelfId:", activeShelfId);

  return (
    <div className="space-y-6">
      <RowControls />
      
      <ColumnControls />
      
      <Separator className="my-2" />
      
      <VerticalDividersControl />
    </div>
  );
};

export default LayoutTab;
