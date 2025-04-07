
import React from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useTheme } from '@/hooks/useTheme';
import { Card } from "@/components/ui/card";
import { ThemeName } from '@/themes';

const ThemesTab: React.FC = () => {
  const { activeTheme, setActiveTheme, themes, availableThemes } = useTheme();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Theme Selection</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Choose a preset theme for your bookshelf
        </p>
        
        <RadioGroup 
          value={activeTheme} 
          onValueChange={(value) => setActiveTheme(value as ThemeName)}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {availableThemes.map((themeName) => (
            <Card 
              key={themeName}
              className={`relative p-4 flex flex-col gap-4 cursor-pointer hover:bg-accent/10 transition-colors ${
                activeTheme === themeName ? 'border-2 border-primary' : ''
              }`}
              onClick={() => setActiveTheme(themeName as ThemeName)}
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value={themeName} id={`theme-${themeName}`} />
                <Label htmlFor={`theme-${themeName}`} className="text-base font-medium">
                  {themes[themeName].name}
                </Label>
              </div>
              
              <div 
                className="h-20 w-full rounded-md border overflow-hidden bg-cover bg-center"
                style={{ 
                  backgroundImage: `url(${themes[themeName].textures.background})`,
                  backgroundColor: themes[themeName].variables['--container-bg'] || '#a47148'
                }}
              >
                <div 
                  className="w-full h-4 mt-10"
                  style={{ 
                    backgroundColor: themes[themeName].variables['--shelf-color'] || '#8B5A2B',
                    opacity: 0.9
                  }}
                />
              </div>
            </Card>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
};

export default ThemesTab;
