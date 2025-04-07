
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
    if (themeName === 'custom') return "Your Custom Theme";
    
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
  
  // Container and items animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20
      }
    }
  };
  
  return (
    <RadioGroup 
      value={activeTheme || 'default'} 
      onValueChange={(value) => onThemeSelect(value as ThemeName)}
      className="theme-list-container"
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5"
      >
        {/* Theme variants with staggered animation */}
        {availableThemes.map((themeName) => (
          <motion.div
            key={themeName}
            variants={itemVariants}
            className="card-3d-effect"
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
          variants={itemVariants}
          className="card-3d-effect"
        >
          <ThemeCard
            themeName="custom"
            displayName="Your Custom Theme"
            theme={themes.custom}
            isActive={activeTheme === 'custom'}
            isLoading={isSelecting === 'custom'}
            isDeletable={false}
            onSelect={onThemeSelect}
          />
        </motion.div>
      </motion.div>
    </RadioGroup>
  );
};

export default ThemeList;
