
import React from 'react';
import { useBookshelfStore } from "@/store/bookshelfStore";
import ShelfAppearanceSection from './shelves/ShelfAppearanceSection';
import DividersSection from './shelves/DividersSection';

const ShelvesTab: React.FC = () => {
  const { ui, setLinkDividerToShelfColor } = useBookshelfStore();
  
  return (
    <div className="space-y-6">
      <ShelfAppearanceSection linkDividerStyling={ui.linkDividerToShelfColor} />
      <DividersSection 
        linkDividerStyling={ui.linkDividerToShelfColor} 
        setLinkDividerStyling={setLinkDividerToShelfColor} 
      />
    </div>
  );
};

export default ShelvesTab;
