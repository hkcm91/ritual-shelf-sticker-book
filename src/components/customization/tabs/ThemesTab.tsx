
import React, { useCallback, useState } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { toast } from "sonner";
import { ThemeName } from '@/themes';
import CurrentThemeDisplay from './themes/CurrentThemeDisplay';
import ThemeList from './themes/ThemeList';
import RefreshThemeButton from './themes/RefreshThemeButton';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const ThemesTab: React.FC = () => {
  const { activeTheme, setActiveTheme, themes, availableThemes, loadSavedTheme } = useTheme();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSelecting, setIsSelecting] = useState<string | null>(null);
  const [themeToDelete, setThemeToDelete] = useState<ThemeName | null>(null);

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

  // Function to handle theme deletion
  const handleThemeDelete = useCallback((themeName: ThemeName) => {
    // Open confirmation dialog before deleting
    setThemeToDelete(themeName);
  }, []);

  // Function to confirm theme deletion
  const confirmThemeDeletion = useCallback(() => {
    if (!themeToDelete) return;

    try {
      // If the active theme is being deleted, switch to default theme
      if (activeTheme === themeToDelete) {
        setActiveTheme('default');
      }

      // Remove theme from localStorage (this will not actually delete the theme file)
      try {
        const customThemes = localStorage.getItem('custom-themes') || '[]';
        const themes = JSON.parse(customThemes);
        const updatedThemes = themes.filter((theme: string) => theme !== themeToDelete);
        localStorage.setItem('custom-themes', JSON.stringify(updatedThemes));
      } catch (storageError) {
        console.error("Error updating localStorage:", storageError);
      }

      toast.success(`Theme "${themeToDelete}" removed`);
      
      // In a real application, we would delete the theme file from the server here
      console.log(`Theme "${themeToDelete}" would be deleted from the server in a real application`);
      
      // Refresh theme list
      loadSavedTheme();
    } catch (error) {
      console.error("Error deleting theme:", error);
      toast.error("Failed to delete theme");
    } finally {
      setThemeToDelete(null);
    }
  }, [themeToDelete, activeTheme, setActiveTheme, loadSavedTheme]);

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
          onThemeDelete={handleThemeDelete}
          isValidTheme={isValidTheme}
        />
      </div>

      {/* Confirmation Dialog for Theme Deletion */}
      <AlertDialog 
        open={!!themeToDelete} 
        onOpenChange={(open) => !open && setThemeToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Theme</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this theme? This action cannot be undone.
              {themeToDelete === activeTheme && (
                <p className="mt-2 font-semibold text-destructive">
                  This is your current active theme. Deleting it will switch you to the default theme.
                </p>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmThemeDeletion}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ThemesTab;
