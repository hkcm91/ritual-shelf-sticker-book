
import React from 'react';
import { RadioGroup } from "@/components/ui/radio-group";
import { ThemeName } from '@/themes';
import ThemeCard from './ThemeCard';
import { motion } from "framer-motion";

interface ThemeListProps {
  activeTheme: ThemeName;
  themes: any;
  availableThemes: string[];
  isSelecting: string | null;
  onThemeSelect: (themeName: ThemeName) => void;
  onThemeDelete?: (themeName: ThemeName) => void;
  isValidTheme: (themeName: string) => boolean;
}

const ThemeList: React.FC<ThemeListProps> = ({
  activeTheme,
  themes,
  availableThemes,
  isSelecting,
  onThemeSelect,
  onThemeDelete,
  isValidTheme
}) => {
  // Helper function to get display name
  const getDisplayName = (themeName: string): string => {
    if (themeName === 'custom') return "Custom Theme";
    
    const isValid = isValidTheme(themeName);
    const theme = isValid ? themes[themeName as keyof typeof themes] : themes.default;
    return isValid ? theme?.name || "Unknown Theme" : "Invalid Theme";
  };

  // Helper function to determine if a theme is deletable
  const isDeletableTheme = (themeName: string): boolean => {
    // Prevent deletion of default, custom, and core themes
    const nonDeletableThemes = ['default', 'custom', 'dark-academia', 'cozy-cottage', 'modern-library'];
    return !nonDeletableThemes.includes(themeName);
  };
  
  return (
    <RadioGroup 
      value={activeTheme || 'default'} 
      onValueChange={(value) => onThemeSelect(value as ThemeName)}
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
    >
      {/* Theme variants with staggered animation */}
      {availableThemes.map((themeName, index) => (
        <motion.div
          key={themeName}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.3, 
            delay: 0.05 * index,
            ease: "easeOut"
          }}
        >
          <ThemeCard
            themeName={themeName}
            displayName={getDisplayName(themeName)}
            theme={isValidTheme(themeName) ? themes[themeName as keyof typeof themes] : themes.default}
            isActive={activeTheme === themeName}
            isLoading={isSelecting === themeName}
            isDeletable={isDeletableTheme(themeName)}
            onSelect={onThemeSelect}
            onDelete={onThemeDelete}
          />
        </motion.div>
      ))}
      
      {/* Add Custom Theme option */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.3, 
          delay: 0.05 * availableThemes.length,
          ease: "easeOut"
        }}
      >
        <ThemeCard
          themeName="custom"
          displayName="Custom Theme"
          theme={themes.custom}
          isActive={activeTheme === 'custom'}
          isLoading={isSelecting === 'custom'}
          isDeletable={false}
          onSelect={onThemeSelect}
        />
      </motion.div>
    </RadioGroup>
  );
};

export default ThemeList;
