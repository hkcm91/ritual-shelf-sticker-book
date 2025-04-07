
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
import { motion } from "framer-motion";

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
      toast.success("Theme refreshed", {
        icon: "🔄",
      });
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
        
        // Add success toast with animation
        toast.success(`Theme changed to ${themes[value]?.name || "Custom"}`, {
          icon: "✨",
          duration: 2000,
          position: "bottom-center",
        });
      }
    } catch (error) {
      console.error("Error selecting theme:", error);
      toast.error("Failed to select theme");
    } finally {
      // Add delay before allowing new selections
      setTimeout(() => setIsSelecting(null), 800);
    }
  }, [setActiveTheme, activeTheme, isSelecting, themes]);

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

      toast.success(`Theme "${themeToDelete}" removed`, {
        icon: "🗑️",
      });
      
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
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-medium">Theme Collection</h3>
          <RefreshThemeButton 
            isRefreshing={isRefreshing} 
            onRefresh={handleRefreshTheme} 
          />
        </div>
        
        <p className="text-sm text-muted-foreground mb-4">
          Choose a magical theme for your bookshelf
        </p>
        
        <Alert variant="default" className="mb-4 border-amber-200/30 bg-amber-50/10">
          <Info className="h-4 w-4 text-amber-500" />
          <AlertDescription className="text-muted-foreground">
            Changes made in other tabs are saved as your "Custom" theme.
            You can always return to a preset theme using the cards below.
          </AlertDescription>
        </Alert>
        
        <motion.div 
          className="theme-preview-grid grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          {activeTheme && (
            <CurrentThemeDisplay 
              activeTheme={activeTheme as ThemeName} 
              themes={themes} 
            />
          )}
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <ThemeList
            activeTheme={activeTheme as ThemeName}
            themes={themes}
            availableThemes={availableThemes}
            isSelecting={isSelecting}
            onThemeSelect={handleThemeSelect}
            onThemeDelete={handleThemeDelete}
            isValidTheme={isValidTheme}
          />
        </motion.div>
      </div>

      {/* Confirmation Dialog for Theme Deletion */}
      <AlertDialog 
        open={!!themeToDelete} 
        onOpenChange={(open) => !open && setThemeToDelete(null)}
      >
        <AlertDialogContent className="border-amber-200/50 bg-gradient-to-b from-slate-900/90 to-slate-800/90 text-slate-100">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-amber-100">Delete Theme</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-300">
              Are you sure you want to delete this theme? This action cannot be undone.
              {themeToDelete === activeTheme && (
                <p className="mt-2 font-semibold text-red-400">
                  This is your current active theme. Deleting it will switch you to the default theme.
                </p>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmThemeDeletion}
              className="bg-red-500/80 text-white hover:bg-red-600/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
};

export default ThemesTab;
