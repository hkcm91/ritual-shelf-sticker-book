
import React from 'react';
import { Button } from "@/components/ui/button";
import { useBookshelfStore } from "@/store/bookshelfStore";

const ActionButtons: React.FC = () => {
  const { saveCustomization, resetCustomization } = useBookshelfStore();
  
  return (
    <div className="flex justify-between">
      <Button variant="outline" onClick={resetCustomization}>
        Reset to Defaults
      </Button>
      <Button onClick={saveCustomization}>
        Save Changes
      </Button>
    </div>
  );
};

export default ActionButtons;
