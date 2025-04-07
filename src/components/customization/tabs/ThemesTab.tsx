
import React from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useTheme } from '@/hooks/useTheme';
import { Card } from "@/components/ui/card";
import { ThemeName } from '@/themes';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";

const ThemesTab: React.FC = () => {
  const { activeTheme, setActiveTheme, themes, availableThemes, loadSavedTheme } = useTheme();

  // Function to handle theme refresh/reload
  const handleRefreshTheme = () => {
    loadSavedTheme();
  };

  // Function to handle theme selection without causing navigation
  const handleThemeSelect = (value: ThemeName) => {
    if (setActiveTheme) {
      setActiveTheme(value);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-medium">Theme Presets</h3>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefreshTheme}
            className="text-xs"
          >
            <Palette className="h-3 w-3 mr-1" />
            Refresh Theme
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
                Current Theme: {themes[activeTheme as keyof typeof themes]?.name || "Custom Theme"}
              </h4>
              <div 
                className="h-24 w-full rounded-md border overflow-hidden bg-cover bg-center"
                style={{ 
                  backgroundImage: `url(${themes[activeTheme as keyof typeof themes]?.textures?.background})`,
                  backgroundColor: themes[activeTheme as keyof typeof themes]?.variables?.['--container-bg'] || '#a47148'
                }}
              >
                <div 
                  className="w-full h-6 mt-12"
                  style={{ 
                    backgroundColor: themes[activeTheme as keyof typeof themes]?.variables?.['--shelf-color'] || '#8B5A2B',
                    opacity: 0.9
                  }}
                />
              </div>
            </Card>
          )}
        </div>
        
        <RadioGroup 
          value={activeTheme} 
          onValueChange={(value) => handleThemeSelect(value as ThemeName)}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
        >
          {availableThemes.map((themeName) => (
            <Card 
              key={themeName}
              className={`relative p-4 flex flex-col gap-4 cursor-pointer hover:bg-accent/10 transition-colors ${
                activeTheme === themeName ? 'border-2 border-primary' : ''
              }`}
              onClick={(e) => {
                e.preventDefault();
                handleThemeSelect(themeName as ThemeName);
              }}
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value={themeName} id={`theme-${themeName}`} />
                <Label htmlFor={`theme-${themeName}`} className="text-base font-medium">
                  {themes[themeName]?.name || "Unknown Theme"}
                </Label>
              </div>
              
              <div 
                className="h-20 w-full rounded-md border overflow-hidden bg-cover bg-center"
                style={{ 
                  backgroundImage: `url(${themes[themeName]?.textures?.background})`,
                  backgroundColor: themes[themeName]?.variables?.['--container-bg'] || '#a47148'
                }}
              >
                <div 
                  className="w-full h-4 mt-10"
                  style={{ 
                    backgroundColor: themes[themeName]?.variables?.['--shelf-color'] || '#8B5A2B',
                    opacity: 0.9
                  }}
                />
              </div>
            </Card>
          ))}
          
          {/* Add Custom Theme option */}
          <Card 
            className={`relative p-4 flex flex-col gap-4 cursor-pointer hover:bg-accent/10 transition-colors ${
              activeTheme === 'custom' ? 'border-2 border-primary' : ''
            }`}
            onClick={(e) => {
              e.preventDefault();
              handleThemeSelect('custom' as ThemeName);
            }}
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem value="custom" id="theme-custom" />
              <Label htmlFor="theme-custom" className="text-base font-medium">
                Custom Theme
              </Label>
            </div>
            
            <div className="h-20 w-full rounded-md border overflow-hidden bg-gradient-to-r from-blue-200 via-pink-200 to-purple-200">
              <div className="w-full h-4 mt-10 bg-gradient-to-r from-purple-500 to-indigo-500 opacity-0.9" />
            </div>
          </Card>
        </RadioGroup>
      </div>
    </div>
  );
};

export default ThemesTab;
