
import React, { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from 'sonner';
import { 
  generateHarmonies,
  generateShadesAndTints,
  generatePalette
} from './color-utils/colorConversion';
import HarmonyTab from './color-chart/HarmonyTab';
import ShadesTab from './color-chart/ShadesTab';
import PaletteTab from './color-chart/PaletteTab';
import SavedColors from './color-chart/SavedColors';

// Interface for the color chart component
interface ColorChartProps {
  baseColor: string;
  onSelectColor: (color: string) => void;
}

const ColorChart: React.FC<ColorChartProps> = ({ baseColor, onSelectColor }) => {
  const [activeTab, setActiveTab] = useState('harmony');
  const [harmonies, setHarmonies] = useState<string[]>([]);
  const [shades, setShades] = useState<string[]>([]);
  const [palette, setPalette] = useState<string[]>([]);
  const [customColors, setCustomColors] = useState<string[]>([]);

  // Generate color variations based on baseColor
  useEffect(() => {
    if (!baseColor) return;
    
    try {
      setHarmonies(generateHarmonies(baseColor));
      setShades(generateShadesAndTints(baseColor));
      setPalette(generatePalette(baseColor));
    } catch (error) {
      console.error('Error generating color harmonies:', error);
    }
  }, [baseColor]);

  // Save a color to custom colors
  const saveToCustomColors = (color: string) => {
    if (customColors.includes(color)) return;
    setCustomColors(prev => [color, ...prev].slice(0, 12)); // Keep only the latest 12 colors
    toast.success(`Color ${color} saved to custom colors`);
  };
  
  // Copy color to clipboard
  const copyToClipboard = (color: string) => {
    navigator.clipboard.writeText(color)
      .then(() => toast.success(`Copied ${color} to clipboard`))
      .catch(err => toast.error('Failed to copy color to clipboard'));
  };

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="harmony">Harmony</TabsTrigger>
          <TabsTrigger value="shades">Shades</TabsTrigger>
          <TabsTrigger value="palette">Palette</TabsTrigger>
        </TabsList>
        
        {/* Harmony tab */}
        <TabsContent value="harmony">
          <HarmonyTab 
            harmonies={harmonies}
            onSelectColor={onSelectColor}
            onCopyColor={copyToClipboard}
            onSaveColor={saveToCustomColors}
          />
        </TabsContent>
        
        {/* Shades tab */}
        <TabsContent value="shades">
          <ShadesTab 
            shades={shades}
            onSelectColor={onSelectColor}
            onCopyColor={copyToClipboard}
            onSaveColor={saveToCustomColors}
          />
        </TabsContent>
        
        {/* Palette tab */}
        <TabsContent value="palette">
          <PaletteTab 
            palette={palette}
            onSelectColor={onSelectColor}
            onCopyColor={copyToClipboard}
            onSaveColor={saveToCustomColors}
          />
        </TabsContent>
      </Tabs>
      
      {/* Custom colors section */}
      <SavedColors 
        customColors={customColors}
        onSelectColor={onSelectColor}
      />
    </div>
  );
};

export default ColorChart;
