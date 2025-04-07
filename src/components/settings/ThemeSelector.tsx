
import React, { useCallback } from 'react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTheme } from '@/hooks/useTheme';
import { ThemeName } from '@/themes';

const ThemeSelector: React.FC = () => {
  const { activeTheme, setActiveTheme, themes, availableThemes } = useTheme();
  
  // Wrap the theme change handler in useCallback to prevent recreating on each render
  const handleThemeChange = useCallback((value: string) => {
    if (value !== activeTheme) {
      setActiveTheme(value as ThemeName);
    }
  }, [activeTheme, setActiveTheme]);
  
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Theme</label>
      <Select 
        value={activeTheme} 
        onValueChange={handleThemeChange}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a theme" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Themes</SelectLabel>
            {availableThemes.map((themeName) => (
              <SelectItem key={themeName} value={themeName}>
                {themes[themeName].name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <p className="text-xs text-muted-foreground mt-1">
        Select a theme to customize your bookshelf appearance
      </p>
    </div>
  );
};

export default ThemeSelector;
