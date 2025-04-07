
import { useState, useCallback } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { toast } from "sonner";
import { ThemeName } from '@/themes';

export const useThemes = () => {
  const { activeTheme, setActiveTheme, themes, availableThemes, loadSavedTheme } = useTheme();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSelecting, setIsSelecting] = useState<string | null>(null);
  const [themeToDelete, setThemeToDelete] = useState<ThemeName | null>(null);
  const [showThemeAppliedEffect, setShowThemeAppliedEffect] = useState(false);

  // Function to handle theme refresh/reload with error handling
  const handleRefreshTheme = useCallback(() => {
    setIsRefreshing(true);
    try {
      loadSavedTheme();
      toast.success("Magical themes refreshed", {
        icon: "🔄",
        style: {
          background: "linear-gradient(to right, #614385, #516395)",
          color: "white",
          border: "1px solid rgba(255,255,255,0.1)",
        }
      });
    } catch (error) {
      console.error("Error refreshing theme:", error);
      toast.error("Failed to refresh themes");
    } finally {
      // Add small delay for UI feedback
      setTimeout(() => setIsRefreshing(false), 700);
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
        setShowThemeAppliedEffect(true);
        
        // Add success toast with animation
        toast.success(`Theme changed to ${themes[value]?.name || "Custom"}`, {
          icon: "✨",
          duration: 3000,
          position: "bottom-center",
          style: {
            background: "linear-gradient(to right, #614385, #516395)",
            color: "white",
            border: "1px solid rgba(255,255,255,0.1)",
          }
        });
      }
    } catch (error) {
      console.error("Error selecting theme:", error);
      toast.error("Failed to select theme");
    } finally {
      // Add delay before allowing new selections
      setTimeout(() => {
        setIsSelecting(null);
        // Hide theme applied effect after a delay
        setTimeout(() => setShowThemeAppliedEffect(false), 1000);
      }, 800);
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
      // If the active theme is being deleted, switch to default
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
        style: {
          background: "linear-gradient(to right, #614385, #516395)",
          color: "white",
          border: "1px solid rgba(255,255,255,0.1)",
        }
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

  return {
    activeTheme,
    themes,
    availableThemes,
    isRefreshing,
    isSelecting,
    themeToDelete,
    showThemeAppliedEffect,
    handleRefreshTheme,
    handleThemeSelect,
    handleThemeDelete,
    confirmThemeDeletion,
    isValidTheme
  };
};
