
import React from 'react';
import { Button } from "@/components/ui/button";
import { Palette } from 'lucide-react';
import { useBookshelfStore } from '@/store/bookshelfStore';
import ThemeSelector from '../ThemeSelector';

interface AppearanceTabProps {
  onCloseDrawer: () => void;
}

const AppearanceTab: React.FC<AppearanceTabProps> = ({ onCloseDrawer }) => {
  const { openCustomizationModal } = useBookshelfStore();
  
  const handleOpenCustomization = () => {
    onCloseDrawer();
    setTimeout(() => {
      openCustomizationModal();
    }, 100);
  };

  return (
    <div className="space-y-6">
      <ThemeSelector />
      <div className="mt-4">
        <Button 
          variant="outline" 
          className="w-full" 
          onClick={handleOpenCustomization}
        >
          <Palette className="mr-2 h-4 w-4" />
          Advanced Customization
        </Button>
      </div>
    </div>
  );
};

export default AppearanceTab;
