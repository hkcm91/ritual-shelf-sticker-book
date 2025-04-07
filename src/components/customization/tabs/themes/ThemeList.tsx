
import React from 'react';
import { RadioGroup } from "@/components/ui/radio-group";
import { ThemeName } from '@/themes';
import ThemeCard from './ThemeCard';

interface ThemeListProps {
  activeTheme: ThemeName;
  themes: any;
  availableThemes: string[];
  isSelecting: string | null;
  onThemeSelect: (themeName: ThemeName) => void;
  isValidTheme: (themeName: string) => boolean;
}

const ThemeList: React.FC<ThemeListProps> = ({
  activeTheme,
  themes,
  availableThemes,
  isSelecting,
  onThemeSelect,
  isValidTheme
}) => {
  // Helper function to get display name
  const getDisplayName = (themeName: string): string => {
    if (themeName === 'custom') return "Custom Theme";
    
    const isValid = isValidTheme(themeName);
    const theme = isValid ? themes[themeName as keyof typeof themes] : themes.default;
    return isValid ? theme?.name || "Unknown Theme" : "Invalid Theme";
  };
  
  return (
    <RadioGroup 
      value={activeTheme || 'default'} 
      onValueChange={(value) => onThemeSelect(value as ThemeName)}
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
    >
      {availableThemes.map((themeName) => (
        <ThemeCard
          key={themeName}
          themeName={themeName}
          displayName={getDisplayName(themeName)}
          theme={isValidTheme(themeName) ? themes[themeName as keyof typeof themes] : themes.default}
          isActive={activeTheme === themeName}
          isLoading={isSelecting === themeName}
          onSelect={onThemeSelect}
        />
      ))}
      
      {/* Add Custom Theme option */}
      <ThemeCard
        themeName="custom"
        displayName="Custom Theme"
        theme={themes.custom}
        isActive={activeTheme === 'custom'}
        isLoading={isSelecting === 'custom'}
        onSelect={onThemeSelect}
      />
    </RadioGroup>
  );
};

export default ThemeList;
