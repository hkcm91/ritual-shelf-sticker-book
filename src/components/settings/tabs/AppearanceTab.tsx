
import React from 'react';
import ThemeSelector from '../ThemeSelector';
import { Card, CardContent } from "@/components/ui/card";

interface AppearanceTabProps {
  onCloseDrawer: () => void;
}

const AppearanceTab: React.FC<AppearanceTabProps> = ({ onCloseDrawer }) => {
  return (
    <div className="space-y-6">
      <Card className="bg-amber-950/20 border border-amber-700/30">
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold text-amber-300 mb-4">Themes</h3>
          <ThemeSelector />
        </CardContent>
      </Card>
      
      <div className="text-sm text-amber-200/70 p-3 bg-amber-900/20 rounded-lg border border-amber-800/20">
        Select from our curated collection of themes to instantly transform your bookshelf's appearance.
        Each theme includes matching dividers and shelf styling.
      </div>
    </div>
  );
};

export default AppearanceTab;
