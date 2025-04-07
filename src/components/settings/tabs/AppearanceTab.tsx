
import React from 'react';
import ThemeSelector from '../ThemeSelector';
import { Card, CardContent } from "@/components/ui/card";

interface AppearanceTabProps {
  onCloseDrawer: () => void;
}

const AppearanceTab: React.FC<AppearanceTabProps> = ({ onCloseDrawer }) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <ThemeSelector />
        </CardContent>
      </Card>
      
      <div className="text-sm text-muted-foreground">
        Select from our curated collection of themes to instantly transform your bookshelf's appearance.
        Each theme includes matching dividers and shelf styling.
      </div>
    </div>
  );
};

export default AppearanceTab;
