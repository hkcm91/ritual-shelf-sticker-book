
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import PaletteTab from './color-chart/PaletteTab';
import ShadesTab from './color-chart/ShadesTab';
import HarmonyTab from './color-chart/HarmonyTab';
import SavedColors from './color-chart/SavedColors';
import ColorControls from './color-chart/ColorControls';
import ColorPickerCanvas from './color-chart/ColorPickerCanvas';
import HueSlider from './color-chart/HueSlider';
import { hexToHsv, hsvToHex } from './color-utils/hsvConversion';
import { 
  generateShadesAndTints, 
  generateHarmonies, 
  hexToRgb, 
  rgbToHex,
  rgbToHsl,
  hslToRgb,
  generatePalette
} from './color-utils/colorConversion';

interface ColorChartProps {
  color: string;
  onChange: (color: string) => void;
  onClose?: () => void;
}

const ColorChart: React.FC<ColorChartProps> = ({ color, onChange, onClose }) => {
  const [currentColor, setCurrentColor] = useState(color || '#ffffff');
  const [inputColor, setInputColor] = useState(color || '#ffffff');
  const [customColors, setCustomColors] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("shades");
  const [hsv, setHsv] = useState({ h: 0, s: 100, v: 100 });
  const [shades, setShades] = useState<string[]>([]);
  const [harmonies, setHarmonies] = useState<string[]>([]);
  
  // Load saved colors from localStorage on mount
  useEffect(() => {
    const savedColors = localStorage.getItem('customColors');
    if (savedColors) {
      setCustomColors(JSON.parse(savedColors));
    }
  }, []);

  // Update state when color prop changes
  useEffect(() => {
    if (color !== currentColor) {
      setCurrentColor(color);
      setInputColor(color);
      setHsv(hexToHsv(color));
    }
  }, [color, currentColor]);

  // Update derived colors when HSV changes
  useEffect(() => {
    const hex = hsvToHex(hsv);
    setCurrentColor(hex);
    setInputColor(hex);
    setShades(generateShadesAndTints(hex));
    setHarmonies(generateHarmonies(hex));
  }, [hsv]);

  // Handle color input field change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputColor(value);
    
    if (/^#[0-9A-F]{6}$/i.test(value)) {
      setCurrentColor(value);
      setHsv(hexToHsv(value));
    }
  };

  // Handle saturation and value change from the picker
  const handleSaturationValueChange = (s: number, v: number) => {
    setHsv(prev => ({ ...prev, s, v }));
  };

  // Handle hue change from the slider
  const handleHueChange = (h: number) => {
    setHsv(prev => ({ ...prev, h }));
  };

  // Color selection from swatches, shades, etc.
  const handleSelectColor = (selectedColor: string) => {
    setCurrentColor(selectedColor);
    setInputColor(selectedColor);
    setHsv(hexToHsv(selectedColor));
    onChange(selectedColor);
  };

  // Copy color to clipboard
  const handleCopyColor = (colorToCopy: string) => {
    navigator.clipboard.writeText(colorToCopy);
    toast.success(`Copied ${colorToCopy} to clipboard`);
  };

  // Save color to local storage
  const handleSaveColor = (colorToSave: string) => {
    if (!customColors.includes(colorToSave)) {
      const updatedColors = [...customColors, colorToSave].slice(-24);
      setCustomColors(updatedColors);
      localStorage.setItem('customColors', JSON.stringify(updatedColors));
      toast.success(`Saved ${colorToSave} to your collection`);
    } else {
      toast.info("This color is already in your saved colors");
    }
  };

  // Generate random color
  const handleRandomColor = () => {
    const h = Math.floor(Math.random() * 360);
    const s = Math.floor(Math.random() * 30) + 70;
    const v = Math.floor(Math.random() * 30) + 70;
    setHsv({ h, s, v });
  };

  // Update external onChange when color changes (after user finishes interaction)
  const applyColorChange = () => {
    onChange(currentColor);
  };

  return (
    <div className="color-chart w-full p-1 shadow-lg rounded-md">
      <div className="color-picker-section mb-4 border rounded-lg p-3">
        <ColorControls
          currentColor={currentColor}
          inputColor={inputColor}
          onInputChange={handleInputChange}
          onCopyColor={handleCopyColor}
          onSaveColor={handleSaveColor}
          onRandomColor={handleRandomColor}
        />

        <ColorPickerCanvas
          hue={hsv.h}
          saturation={hsv.s}
          value={hsv.v}
          onSaturationValueChange={handleSaturationValueChange}
        />

        <HueSlider 
          hue={hsv.h}
          onHueChange={handleHueChange}
        />
      </div>

      <Tabs defaultValue="shades" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-2">
          <TabsTrigger value="shades">Shades</TabsTrigger>
          <TabsTrigger value="harmony">Harmony</TabsTrigger>
          <TabsTrigger value="palette">Palette</TabsTrigger>
        </TabsList>
        
        <TabsContent value="shades" className="mt-0">
          <ShadesTab 
            shades={shades}
            onSelectColor={handleSelectColor}
            onCopyColor={handleCopyColor}
            onSaveColor={handleSaveColor}
          />
        </TabsContent>
        
        <TabsContent value="harmony" className="mt-0">
          <HarmonyTab 
            harmonies={harmonies}
            onSelectColor={handleSelectColor}
            onCopyColor={handleCopyColor}
            onSaveColor={handleSaveColor}
          />
        </TabsContent>
        
        <TabsContent value="palette" className="mt-0">
          <PaletteTab 
            palette={generatePalette(currentColor)}
            onSelectColor={handleSelectColor}
            onCopyColor={handleCopyColor}
            onSaveColor={handleSaveColor}
          />
        </TabsContent>
      </Tabs>
      
      <SavedColors 
        customColors={customColors}
        onSelectColor={handleSelectColor}
      />
    </div>
  );
};

export default ColorChart;
