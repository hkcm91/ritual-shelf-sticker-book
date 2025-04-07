
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useBookshelfStore } from "@/store/bookshelfStore";

const BooksPerSectionControls: React.FC = () => {
  const { 
    shelfStyling, 
    updateDividersSetting
  } = useBookshelfStore();

  return (
    <div className="grid grid-cols-2 gap-4 mt-4">
      <div className="space-y-2">
        <Label>Books Per Section</Label>
        <Input
          type="number"
          min={2}
          max={10}
          value={shelfStyling?.dividers?.booksPerSection || 6}
          onChange={(e) => updateDividersSetting('booksPerSection', parseInt(e.target.value))}
          className="w-full"
          disabled={!['vertical', 'both'].includes(shelfStyling?.dividers?.orientation || 'vertical')}
        />
      </div>
      
      <div className="space-y-2">
        <Label>Books Per Row</Label>
        <Input
          type="number"
          min={1}
          max={10}
          value={shelfStyling?.dividers?.booksPerRow || 2}
          onChange={(e) => updateDividersSetting('booksPerRow', parseInt(e.target.value))}
          className="w-full"
          disabled={!['horizontal', 'both'].includes(shelfStyling?.dividers?.orientation || 'vertical')}
        />
      </div>
    </div>
  );
};

export default BooksPerSectionControls;
