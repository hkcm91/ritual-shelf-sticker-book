
import React, { useState } from 'react';
import ShelfAppearanceSection from './shelves/ShelfAppearanceSection';
import DividersSection from './shelves/DividersSection';

const ShelvesTab: React.FC = () => {
  // Add state to track if divider styling is linked
  const [linkDividerStyling, setLinkDividerStyling] = useState(true);

  return (
    <div className="space-y-6">
      <ShelfAppearanceSection linkDividerStyling={linkDividerStyling} />
      <DividersSection 
        linkDividerStyling={linkDividerStyling} 
        setLinkDividerStyling={setLinkDividerStyling} 
      />
    </div>
  );
};

export default ShelvesTab;
