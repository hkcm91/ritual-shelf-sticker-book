
import React from 'react';
import { Card } from "@/components/ui/card";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ThemeName } from '@/themes';
import { Loader2 } from "lucide-react";

interface ThemeCardProps {
  themeName: string;
  displayName: string;
  theme: any;
  isActive: boolean;
  isLoading: boolean;
  onSelect: (themeName: ThemeName) => void;
}

const ThemeCard: React.FC<ThemeCardProps> = ({
  themeName,
  displayName,
  theme,
  isActive,
  isLoading,
  onSelect
}) => {
  // Get the background color and texture for preview
  const backgroundColor = theme?.variables?.['--container-bg'] || '#a47148';
  const backgroundTexture = themeName !== 'custom' 
    ? theme?.textures?.background 
    : theme?.textures?.background;
  const shelfColor = theme?.variables?.['--shelf-color'] || '#8B5A2B';

  return (
    <Card 
      className={`relative p-4 flex flex-col gap-4 cursor-pointer hover:bg-accent/10 transition-colors ${
        isActive ? 'border-2 border-primary' : ''
      }`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onSelect(themeName as ThemeName);
      }}
    >
      <div className="flex items-center gap-2">
        <RadioGroupItem 
          value={themeName} 
          id={`theme-${themeName}`}
          disabled={isLoading}
        />
        <Label htmlFor={`theme-${themeName}`} className="text-base font-medium flex items-center">
          {isLoading && <Loader2 className="h-3 w-3 mr-1 animate-spin" />}
          {displayName}
        </Label>
      </div>
      
      <div 
        className="h-20 w-full rounded-md border overflow-hidden"
        style={{ 
          backgroundImage: backgroundTexture ? `url(${backgroundTexture})` : 'none',
          backgroundColor: backgroundTexture ? 'transparent' : backgroundColor,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div 
          className="w-full h-4 mt-10"
          style={{ 
            backgroundColor: shelfColor,
            opacity: 0.9
          }}
        />
      </div>
    </Card>
  );
};

export default ThemeCard;
