
import React from 'react';
import { Card } from "@/components/ui/card";
import { ThemeName } from '@/themes';

interface CurrentThemeDisplayProps {
  activeTheme: ThemeName;
  themes: any;
}

const CurrentThemeDisplay: React.FC<CurrentThemeDisplayProps> = ({
  activeTheme,
  themes
}) => {
  return (
    <Card className="p-4 border-2 border-primary">
      <h4 className="font-medium mb-2">
        Current Theme: {activeTheme === 'custom' 
          ? "Custom Theme" 
          : (activeTheme && themes[activeTheme as keyof typeof themes]?.name) || "Unknown Theme"}
      </h4>
      <div 
        className="h-24 w-full rounded-md border overflow-hidden bg-cover bg-center"
        style={{ 
          backgroundImage: activeTheme === 'custom'
            ? themes.custom?.textures?.background ? `url(${themes.custom.textures.background})` : undefined
            : activeTheme && themes[activeTheme as keyof typeof themes]?.textures?.background 
              ? `url(${themes[activeTheme as keyof typeof themes]?.textures?.background})` : undefined,
          backgroundColor: activeTheme === 'custom'
            ? themes.custom?.variables?.['--container-bg'] || '#a47148'
            : activeTheme && themes[activeTheme as keyof typeof themes]?.variables?.['--container-bg'] || '#a47148'
        }}
      >
        <div 
          className="w-full h-6 mt-12"
          style={{ 
            backgroundColor: activeTheme === 'custom'
              ? themes.custom?.variables?.['--shelf-color'] || '#8B5A2B'
              : activeTheme && themes[activeTheme as keyof typeof themes]?.variables?.['--shelf-color'] || '#8B5A2B',
            opacity: 0.9
          }}
        />
      </div>
    </Card>
  );
};

export default CurrentThemeDisplay;
