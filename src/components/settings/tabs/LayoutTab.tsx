
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Rows3, Columns, Divide } from 'lucide-react';
import { useBookshelfStore } from '@/store/bookshelfStore';
import { toast } from 'sonner';
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const LayoutTab: React.FC = () => {
  const {
    addRow,
    removeRow,
    addColumn,
    removeColumn,
    activeShelfId,
    shelves,
    initializeDefaultShelf,
    shelfStyling,
    toggleDividers,
    updateDividersSetting
  } = useBookshelfStore();
  
  const [verticalDividersEnabled, setVerticalDividersEnabled] = useState(false);
  const [booksPerSection, setBooksPerSection] = useState(4);
  
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
  
  // Initialize state from shelf styling
  useEffect(() => {
    if (shelfStyling && shelfStyling.dividers) {
      setVerticalDividersEnabled(
        shelfStyling.dividers.enabled && 
        (shelfStyling.dividers.orientation === 'vertical' || shelfStyling.dividers.orientation === 'both')
      );
      setBooksPerSection(shelfStyling.dividers.booksPerSection || 4);
    }
  }, [shelfStyling]);
  
  const shelvesData = shelves || {};
  const activeShelf = activeShelfId ? shelvesData[activeShelfId] : null;
  
  const handleAddRow = () => {
    console.log("Add row clicked, activeShelfId:", activeShelfId);
    if (activeShelfId) {
      addRow();
      toast.success("Row added successfully");
    } else {
      toast.error("No active shelf selected");
    }
  };
  
  const handleRemoveRow = () => {
    console.log("Remove row clicked, activeShelfId:", activeShelfId);
    if (activeShelfId && activeShelf && activeShelf.rows > 1) {
      removeRow();
      toast.success("Row removed successfully");
    } else {
      toast.error("Cannot remove the last row");
    }
  };
  
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

  const handleToggleDividers = (checked: boolean) => {
    // Toggle dividers with vertical orientation
    toggleDividers(checked);
    setVerticalDividersEnabled(checked);
    
    // Set the orientation to vertical or both based on current setting
    if (checked) {
      const newOrientation = shelfStyling?.dividers?.orientation === 'horizontal' ? 'both' : 'vertical';
      updateDividersSetting('orientation', newOrientation);
    }
  };
  
  const handleBooksPerSectionChange = (value: number[]) => {
    const newValue = value[0];
    setBooksPerSection(newValue);
    updateDividersSetting('booksPerSection', newValue);
  };

  console.log("LayoutTab rendering, activeShelfId:", activeShelfId, "activeShelf:", activeShelf);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Rows</h3>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRemoveRow}
            disabled={!activeShelf || activeShelf.rows <= 1}
            className="px-2"
          >
            -
          </Button>
          <div className="flex items-center space-x-1">
            <Rows3 className="h-4 w-4 text-gray-500" />
            <span className="font-medium">{activeShelf ? activeShelf.rows : 0}</span>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleAddRow}
            className="px-2"
          >
            +
          </Button>
        </div>
      </div>
      
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Columns</h3>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRemoveColumn}
            disabled={!activeShelf || activeShelf.columns <= 1}
            className="px-2"
          >
            -
          </Button>
          <div className="flex items-center space-x-1">
            <Columns className="h-4 w-4 text-gray-500" />
            <span className="font-medium">{activeShelf ? activeShelf.columns : 0}</span>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleAddColumn}
            className="px-2"
          >
            +
          </Button>
        </div>
      </div>
      
      <Separator className="my-2" />
      
      <div className="space-y-4">
        <h3 className="text-sm font-medium">Vertical Dividers</h3>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Divide className="h-4 w-4 text-gray-500" />
            <Label htmlFor="vertical-dividers">Enable vertical dividers</Label>
          </div>
          <Switch 
            id="vertical-dividers" 
            checked={verticalDividersEnabled} 
            onCheckedChange={handleToggleDividers} 
          />
        </div>
        
        {verticalDividersEnabled && (
          <div className="space-y-2 pl-6">
            <div className="flex justify-between">
              <Label>Books between dividers</Label>
              <span className="text-sm text-muted-foreground">{booksPerSection}</span>
            </div>
            <Slider
              value={[booksPerSection]}
              min={2}
              max={6}
              step={1}
              onValueChange={handleBooksPerSectionChange}
            />
            <p className="text-xs text-muted-foreground">
              Number of book slots between each vertical divider
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LayoutTab;
