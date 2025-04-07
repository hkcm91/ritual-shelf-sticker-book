
import React from 'react';
import { Card } from "@/components/ui/card";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ThemeName } from '@/themes';
import { Loader2, Trash2 } from "lucide-react";
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

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card 
        className={`relative p-4 flex flex-col gap-4 cursor-pointer hover:bg-accent/10 transition-all duration-300 ${
          isActive ? 'border-2 border-primary shadow-[0_0_10px_rgba(139,92,246,0.3)]' : 'hover:shadow-md'
        }`}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onSelect(themeName as ThemeName);
        }}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <RadioGroupItem 
              value={themeName} 
              id={`theme-${themeName}`}
              disabled={isLoading}
              className={isActive ? "border-primary text-primary" : ""}
            />
            <Label htmlFor={`theme-${themeName}`} className="text-base font-medium flex items-center">
              {isLoading && <Loader2 className="h-3 w-3 mr-1 animate-spin text-amber-400" />}
              {displayName}
            </Label>
          </div>
          
          {isDeletable && onDelete && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:text-destructive hover:bg-destructive/10"
              onClick={handleDelete}
              title="Delete theme"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        <div 
          className="h-32 w-full rounded-md border overflow-hidden transition-all duration-300 hover:brightness-105"
          style={{ 
            backgroundImage: backgroundTexture ? `url(${backgroundTexture})` : 'none',
            backgroundColor: backgroundTexture ? 'transparent' : backgroundColor,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div 
            className="w-full h-5 mt-20"
            style={{ 
              backgroundColor: shelfColor,
              opacity: 0.9
            }}
          />
          <div className="absolute inset-0 p-2 flex items-end justify-end">
            {isActive && (
              <div className="bg-primary/80 text-white text-xs px-2 py-1 rounded-full shadow-lg">
                Active
              </div>
            )}
          </div>
        </div>
        
        {isDeletable && onDelete && (
          <button
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 text-white rounded-full p-1 hover:bg-black/50"
            onClick={handleDelete}
            title="Delete theme"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        )}
      </Card>
    </motion.div>
  );
};

export default ThemeCard;
