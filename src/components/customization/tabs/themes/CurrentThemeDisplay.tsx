
import React from 'react';
import { Card } from "@/components/ui/card";
import { ThemeName } from '@/themes';
import { motion } from "framer-motion";

interface CurrentThemeDisplayProps {
  activeTheme: ThemeName;
  themes: any;
}

const CurrentThemeDisplay: React.FC<CurrentThemeDisplayProps> = ({ activeTheme, themes }) => {
  // Get the current theme data
  const theme = themes[activeTheme as keyof typeof themes] || themes.default;
  
  // Get theme properties for display
  const themeBackgroundColor = theme?.variables?.['--container-bg'] || '#a47148';
  const themeBackgroundImage = theme?.textures?.background || '';
  const shelfColor = theme?.variables?.['--shelf-color'] || '#8B5A2B';
  const pageBackground = theme?.variables?.['--page-bg'] || '#f5f5f5';
  
  // Get palette colors for display
  const paletteColors = [
    shelfColor,
    themeBackgroundColor,
    theme?.variables?.['--header-bg'] || '#413125',
    theme?.variables?.['--divider-color'] || '#714621',
    pageBackground,
  ];
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="col-span-1 md:col-span-2 mb-2"
    >
      <Card className="overflow-hidden border-2 border-amber-300/20 bg-gradient-to-br from-slate-900/90 to-slate-800/90">
        <div className="p-4">
          <h3 className="text-lg font-medium text-amber-100 mb-2">Current Theme: {theme.name}</h3>
          
          <div className="relative w-full h-40 rounded-md overflow-hidden">
            <div
              className="absolute inset-0"
              style={{
                backgroundColor: pageBackground,
                backgroundImage: themeBackgroundImage ? `url(${themeBackgroundImage})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <div
                className="absolute inset-x-0 top-10 h-24 mx-4 rounded-sm"
                style={{
                  backgroundColor: themeBackgroundColor,
                  backgroundImage: theme?.variables?.['--container-bg-image'] === 'none' ? '' 
                    : theme?.variables?.['--container-bg-image'] || '',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.15)'
                }}
              >
                {/* Shelves */}
                <div
                  className="absolute inset-x-0 top-14 h-5"
                  style={{
                    backgroundColor: shelfColor,
                    backgroundImage: theme?.textures?.shelf ? `url(${theme?.textures?.shelf})` : 'none',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                  }}
                />
              </div>
            </div>
          </div>
          
          <div className="mt-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-amber-100/80">Color Palette</span>
            </div>
            <div className="flex gap-1 mt-2">
              {paletteColors.map((color, index) => (
                <motion.div
                  key={`palette-${index}`}
                  className="h-5 rounded-full" 
                  style={{ 
                    backgroundColor: color,
                    width: '20%',
                  }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                />
              ))}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default CurrentThemeDisplay;
