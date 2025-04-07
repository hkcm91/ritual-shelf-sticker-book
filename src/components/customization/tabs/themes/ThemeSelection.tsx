
import React from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { ThemeName } from '@/themes';
import CurrentThemeDisplay from './CurrentThemeDisplay';
import ThemeList from './ThemeList';

interface ThemeSelectionProps {
  activeTheme: ThemeName;
  themes: any;
  availableThemes: string[];
  isSelecting: string | null;
  showThemeAppliedEffect: boolean;
  onThemeSelect: (value: ThemeName) => void;
  onThemeDelete: (themeName: ThemeName) => void;
  isValidTheme: (themeName: string) => boolean;
}

const ThemeSelection: React.FC<ThemeSelectionProps> = ({
  activeTheme,
  themes,
  availableThemes,
  isSelecting,
  showThemeAppliedEffect,
  onThemeSelect,
  onThemeDelete,
  isValidTheme
}) => {
  // Animation variants
  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.3,
        ease: [0.165, 0.84, 0.44, 1]
      }
    }
  };

  return (
    <>
      <motion.div 
        className="theme-preview-grid grid grid-cols-1 md:grid-cols-2 gap-5 mb-6"
        variants={itemVariants}
      >
        {activeTheme && (
          <CurrentThemeDisplay 
            activeTheme={activeTheme} 
            themes={themes} 
          />
        )}
      </motion.div>
      
      <motion.div
        variants={itemVariants}
        className="relative"
      >
        <ThemeList
          activeTheme={activeTheme}
          themes={themes}
          availableThemes={availableThemes}
          isSelecting={isSelecting}
          onThemeSelect={onThemeSelect}
          onThemeDelete={onThemeDelete}
          isValidTheme={isValidTheme}
        />
        
        {/* Theme applied flash effect */}
        <AnimatePresence>
          {showThemeAppliedEffect && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-amber-500/20 to-amber-500/10 pointer-events-none z-50 rounded-lg"
            />
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
};

export default ThemeSelection;
