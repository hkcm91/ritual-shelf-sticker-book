
import React from 'react';
import { motion } from "framer-motion";
import ThemeHeader from './themes/ThemeHeader';
import ThemeSelection from './themes/ThemeSelection';
import ThemeDeleteDialog from './themes/ThemeDeleteDialog';
import { useThemes } from './themes/hooks/useThemes';

const ThemesTab: React.FC = () => {
  const {
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
  } = useThemes();
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.165, 0.84, 0.44, 1],
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  return (
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={containerVariants}>
        <ThemeHeader 
          isRefreshing={isRefreshing} 
          onRefresh={handleRefreshTheme} 
        />
        
        <ThemeSelection 
          activeTheme={activeTheme}
          themes={themes}
          availableThemes={availableThemes}
          isSelecting={isSelecting}
          showThemeAppliedEffect={showThemeAppliedEffect}
          onThemeSelect={handleThemeSelect}
          onThemeDelete={handleThemeDelete}
          isValidTheme={isValidTheme}
        />
      </motion.div>

      {/* Confirmation Dialog for Theme Deletion */}
      <ThemeDeleteDialog 
        themeToDelete={themeToDelete}
        onClose={() => themeToDelete && confirmThemeDeletion()}
        onConfirm={confirmThemeDeletion}
        isActiveTheme={themeToDelete === activeTheme}
      />
    </motion.div>
  );
};

export default ThemesTab;
