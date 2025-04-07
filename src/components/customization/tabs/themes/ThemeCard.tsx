
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ThemeName } from '@/themes';
import { Loader2, Trash2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface ThemeCardProps {
  themeName: string;
  displayName: string;
  theme: any;
  isActive: boolean;
  isLoading: boolean;
  isDeletable: boolean;
  onSelect: (themeName: ThemeName) => void;
  onDelete?: (themeName: ThemeName) => void;
}

const ThemeCard: React.FC<ThemeCardProps> = ({
  themeName,
  displayName,
  theme,
  isActive,
  isLoading,
  isDeletable = false,
  onSelect,
  onDelete
}) => {
  const [sparklePosition, setSparklePosition] = useState({ x: 50, y: 50, size: 80 });
  
  // Get the background color and texture for preview
  const backgroundColor = theme?.variables?.['--container-bg'] || '#a47148';
  const backgroundTexture = themeName !== 'custom' 
    ? theme?.textures?.background 
    : theme?.textures?.background;
  const shelfColor = theme?.variables?.['--shelf-color'] || '#8B5A2B';

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (onDelete) {
      onDelete(themeName as ThemeName);
    }
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isActive) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setSparklePosition({
      x: x,
      y: y,
      size: 120
    });
    
    // Update CSS variables
    const target = e.currentTarget as HTMLElement;
    target.style.setProperty('--sparkle-x', `${x}%`);
    target.style.setProperty('--sparkle-y', `${y}%`);
    target.style.setProperty('--sparkle-size', `120px`);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.4, 
        type: "spring", 
        stiffness: 300, 
        damping: 20 
      }}
      className={isActive ? "theme-selected" : ""}
    >
      <Card 
        className={`relative p-5 flex flex-col gap-4 cursor-pointer hover:bg-accent/10 transition-all duration-300 overflow-hidden ${
          isActive ? 'border-2 border-primary shadow-[0_0_15px_rgba(139,92,246,0.4)] theme-card-active' : 'hover:shadow-md'
        }`}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onSelect(themeName as ThemeName);
        }}
        onMouseMove={handleMouseMove}
      >
        <div className="flex items-center justify-between gap-2 z-10">
          <div className="flex items-center gap-2">
            <RadioGroupItem 
              value={themeName} 
              id={`theme-${themeName}`}
              disabled={isLoading}
              className={isActive ? "border-primary text-primary" : ""}
            />
            <Label htmlFor={`theme-${themeName}`} className="text-base font-medium flex items-center">
              {isLoading && <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin text-amber-400" />}
              {displayName}
            </Label>
          </div>
          
          {isDeletable && onDelete && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:text-destructive hover:bg-destructive/10"
              onClick={handleDelete}
              title="Delete theme"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        <div 
          className="theme-card-image h-40 w-full rounded-md border overflow-hidden transition-all duration-500"
          style={{ 
            backgroundImage: backgroundTexture ? `url(${backgroundTexture})` : 'none',
            backgroundColor: backgroundTexture ? 'transparent' : backgroundColor,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div 
            className="w-full h-8 mt-24"
            style={{ 
              backgroundColor: shelfColor,
              opacity: 0.9
            }}
          />
          <div className="absolute inset-0 flex items-end justify-end p-3">
            {isActive && (
              <motion.div 
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-primary/90 text-white text-xs px-2.5 py-1.5 rounded-full shadow-lg flex items-center gap-1.5"
              >
                <Check className="h-3 w-3" /> Active
              </motion.div>
            )}
          </div>
          
          {/* Sparkle effect element for active themes */}
          <div className="sparkle-effect" />
        </div>
        
        {isDeletable && onDelete && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            whileHover={{ opacity: 1, scale: 1.1 }}
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 text-white rounded-full p-1.5 hover:bg-black/70 z-10"
            onClick={handleDelete}
            title="Delete theme"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </motion.button>
        )}
      </Card>
    </motion.div>
  );
};

export default ThemeCard;
