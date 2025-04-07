
import React, { useCallback, useState } from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useTheme } from '@/hooks/useTheme';
import { Card } from "@/components/ui/card";
import { ThemeName } from '@/themes';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, Palette, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

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

  // Function to handle theme selection without causing navigation
  const handleThemeSelect = useCallback((value: ThemeName) => {
    if (value === activeTheme) return; // Don't reapply the same theme
    
    setIsSelecting(value);
    try {
      if (setActiveTheme) {
        console.log("Selecting theme:", value);
        setActiveTheme(value);
        // Prevent event propagation
        setTimeout(() => setIsSelecting(null), 800); // Add delay for UI feedback
      }
    } catch (error) {
      console.error("Error selecting theme:", error);
      toast.error("Failed to select theme");
      setIsSelecting(null);
    }
    
    // Prevent default and stop propagation
    return false;
  }, [setActiveTheme, activeTheme]);

  // Check if theme is valid
  const isValidTheme = useCallback((themeName: string): boolean => {
    return themeName === 'custom' || !!themes[themeName as keyof typeof themes];
  }, [themes]);

  // Safe theme selection with fallback
  const renderThemeCard = useCallback((themeName: string) => {
    const isValid = isValidTheme(themeName);
    const theme = themeName === 'custom' 
      ? themes.custom 
      : (isValid ? themes[themeName as keyof typeof themes] : themes.default);
    const displayName = themeName === 'custom' 
      ? "Custom Theme" 
      : (isValid ? theme?.name || "Unknown Theme" : "Invalid Theme");
    
    const isLoading = isSelecting === themeName;
    
    return (
      <Card 
        key={themeName}
        className={`relative p-4 flex flex-col gap-4 cursor-pointer hover:bg-accent/10 transition-colors ${
          activeTheme === themeName ? 'border-2 border-primary' : ''
        }`}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleThemeSelect(themeName as ThemeName);
        }}
      >
        <div className="flex items-center gap-2">
          <RadioGroupItem 
            value={themeName} 
            id={`theme-${themeName}`}
            disabled={isLoading}
          />
          <Label htmlFor={`theme-${themeName}`} className="text-base font-medium flex items-center">
            {isLoading && <Loader2 className="h-3 w-3 mr-1 animate-spin" />}
            {displayName}
          </Label>
        </div>
        
        <div 
          className="h-20 w-full rounded-md border overflow-hidden bg-cover bg-center"
          style={{ 
            backgroundImage: themeName === 'custom' 
              ? theme?.textures?.background ? `url(${theme.textures.background})` : undefined
              : theme?.textures?.background ? `url(${theme.textures.background})` : undefined,
            backgroundColor: themeName === 'custom'
              ? theme?.variables?.['--container-bg'] || '#a47148'
              : theme?.variables?.['--container-bg'] || '#a47148'
          }}
        >
          <div 
            className="w-full h-4 mt-10"
            style={{ 
              backgroundColor: theme?.variables?.['--shelf-color'] || '#8B5A2B',
              opacity: 0.9
            }}
          />
        </div>
      </Card>
    );
  }, [activeTheme, handleThemeSelect, isValidTheme, themes, isSelecting]);

  return (
    <div className="space-y-6">
      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-medium">Theme Presets</h3>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={(e) => {
              e.preventDefault();
              handleRefreshTheme();
            }}
            disabled={isRefreshing}
            className="text-xs"
          >
            {isRefreshing 
              ? <Loader2 className="h-3 w-3 mr-1 animate-spin" />
              : <Palette className="h-3 w-3 mr-1" />
            }
            {isRefreshing ? "Refreshing..." : "Refresh Theme"}
          </Button>
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
            <Card className="p-4 border-2 border-primary">
              <h4 className="font-medium mb-2">
                Current Theme: {activeTheme === 'custom' 
                  ? "Custom Theme" 
                  : (activeTheme && themes[activeTheme as keyof typeof themes]?.name) || "Unknown Theme"}
              </h4>
              <div 
                className="h-24 w-full rounded-md border overflow-hidden bg-cover bg-center"
                style={{ 
                  backgroundImage: activeTheme === 'custom'
                    ? themes.custom?.textures?.background ? `url(${themes.custom.textures.background})` : undefined
                    : activeTheme && themes[activeTheme as keyof typeof themes]?.textures?.background 
                      ? `url(${themes[activeTheme as keyof typeof themes]?.textures?.background})` : undefined,
                  backgroundColor: activeTheme === 'custom'
                    ? themes.custom?.variables?.['--container-bg'] || '#a47148'
                    : activeTheme && themes[activeTheme as keyof typeof themes]?.variables?.['--container-bg'] || '#a47148'
                }}
              >
                <div 
                  className="w-full h-6 mt-12"
                  style={{ 
                    backgroundColor: activeTheme === 'custom'
                      ? themes.custom?.variables?.['--shelf-color'] || '#8B5A2B'
                      : activeTheme && themes[activeTheme as keyof typeof themes]?.variables?.['--shelf-color'] || '#8B5A2B',
                    opacity: 0.9
                  }}
                />
              </div>
            </Card>
          )}
        </div>
        
        <RadioGroup 
          value={activeTheme || 'default'} 
          onValueChange={(value) => handleThemeSelect(value as ThemeName)}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
        >
          {availableThemes.map((themeName) => renderThemeCard(themeName))}
          
          {/* Add Custom Theme option */}
          {renderThemeCard('custom')}
        </RadioGroup>
      </div>
    </div>
  );
};

export default ThemesTab;
