
import React, { useCallback, useState } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { toast } from "sonner";
import { ThemeName } from '@/themes';
import CurrentThemeDisplay from './themes/CurrentThemeDisplay';
import ThemeList from './themes/ThemeList';
import RefreshThemeButton from './themes/RefreshThemeButton';

const ThemesTab: React.FC = () => {
  const { activeTheme, setActiveTheme, themes, availableThemes, loadSavedTheme } = useTheme();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSelecting, setIsSelecting] = useState<string | null>(null);

  // Function to handle theme refresh/reload with error handling
  const handleRefreshTheme = useCallback(() => {
    setIsRefreshing(true);
    try {
      loadSavedTheme();
      toast.success("Theme refreshed");
    } catch (error) {
      console.error("Error refreshing theme:", error);
      toast.error("Failed to refresh theme");
    } finally {
      setTimeout(() => setIsRefreshing(false), 500); // Add small delay for UI feedback
    }
  }, [loadSavedTheme]);

  // Function to handle theme selection - with debounce/throttling to prevent rapid changes
  const handleThemeSelect = useCallback((value: ThemeName) => {
    // Skip if already selecting or selecting the same theme
    if (isSelecting || value === activeTheme) return;
    
    setIsSelecting(value);
    try {
      if (setActiveTheme) {
        console.log("Selecting theme:", value);
        setActiveTheme(value);
      }
    } catch (error) {
      console.error("Error selecting theme:", error);
      toast.error("Failed to select theme");
    } finally {
      // Add delay before allowing new selections
      setTimeout(() => setIsSelecting(null), 800);
    }
  }, [setActiveTheme, activeTheme, isSelecting]);

  // Check if theme is valid
  const isValidTheme = useCallback((themeName: string): boolean => {
    return themeName === 'custom' || !!themes[themeName as keyof typeof themes];
  }, [themes]);

  return (
    <div className="space-y-6">
      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-medium">Theme Presets</h3>
          <RefreshThemeButton 
            isRefreshing={isRefreshing} 
            onRefresh={handleRefreshTheme} 
          />
        </div>
        
        <p className="text-sm text-muted-foreground mb-4">
          Choose a preset theme for your bookshelf
        </p>
        
        <Alert variant="default" className="mb-4">
          <Info className="h-4 w-4" />
          <AlertDescription>
            Any changes made in other customization tabs will be saved as your "Custom" theme. You can always return to a preset theme using these options.
          </AlertDescription>
        </Alert>
        
        <div className="theme-preview-grid grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {activeTheme && (
            <CurrentThemeDisplay 
              activeTheme={activeTheme as ThemeName} 
              themes={themes} 
            />
          )}
        </div>
        
        <ThemeList
          activeTheme={activeTheme as ThemeName}
          themes={themes}
          availableThemes={availableThemes}
          isSelecting={isSelecting}
          onThemeSelect={handleThemeSelect}
          isValidTheme={isValidTheme}
        />
      </div>
    </div>
  );
};

export default ThemesTab;
