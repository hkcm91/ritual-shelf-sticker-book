
import React from 'react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTheme } from '@/hooks/useTheme';
import { ThemeName } from '@/themes';

const ThemeSelector: React.FC = () => {
  const { activeTheme, setActiveTheme, themes, availableThemes } = useTheme();
  
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Theme</label>
      <Select 
        value={activeTheme} 
        onValueChange={(value) => setActiveTheme(value as ThemeName)}
      >
        <SelectTrigger>
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
    </div>
  );
};

export default ThemeSelector;
