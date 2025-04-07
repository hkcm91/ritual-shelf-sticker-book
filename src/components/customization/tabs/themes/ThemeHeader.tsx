
import React from 'react';
import { Info, Sparkles } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import RefreshThemeButton from './RefreshThemeButton';

interface ThemeHeaderProps {
  isRefreshing: boolean;
  onRefresh: () => void;
}

const ThemeHeader: React.FC<ThemeHeaderProps> = ({ 
  isRefreshing, 
  onRefresh 
}) => {
  return (
    <>
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-medium flex items-center gap-1.5">
          <span>Theme Collection</span>
          <Sparkles className="h-4 w-4 text-amber-400" />
        </h3>
        <RefreshThemeButton 
          isRefreshing={isRefreshing} 
          onRefresh={onRefresh} 
        />
      </div>
      
      <p className="text-sm text-muted-foreground mb-4">
        Choose a magical theme for your bookshelf
      </p>
      
      <Alert variant="default" className="mb-5 border-amber-200/30 bg-amber-50/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-amber-300/10 to-amber-500/5 opacity-30" />
        <Info className="h-4 w-4 text-amber-500" />
        <AlertDescription className="text-muted-foreground relative z-10">
          Changes made in other tabs are saved as your "Custom" theme.
          You can always return to a preset theme using the cards below.
        </AlertDescription>
      </Alert>
    </>
  );
};

export default ThemeHeader;
