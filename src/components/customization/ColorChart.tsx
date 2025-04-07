
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Check, Circle, CircleDashed, Copy, Palette } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// Color utilities
const hexToRgb = (hex: string): [number, number, number] | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
  ] : null;
};

const rgbToHex = (r: number, g: number, b: number): string => {
  return '#' + [r, g, b].map(x => {
    const hex = Math.max(0, Math.min(255, Math.round(x))).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
};

// RGB to HSL conversion
const rgbToHsl = (r: number, g: number, b: number): [number, number, number] => {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    h = max === r
      ? (g - b) / d + (g < b ? 6 : 0)
      : max === g
        ? (b - r) / d + 2
        : (r - g) / d + 4;
    h /= 6;
  }

  return [h, s, l];
};

// HSL to RGB conversion
const hslToRgb = (h: number, s: number, l: number): [number, number, number] => {
  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
};

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

  // Generate color harmonies
  useEffect(() => {
    if (!baseColor) return;
    
    try {
      // Parse the base color
      const rgb = hexToRgb(baseColor);
      if (!rgb) return;
      
      const [h, s, l] = rgbToHsl(...rgb);
      
      // Generate harmonies
      const harmonies = [
        baseColor, // Original
        rgbToHex(...hslToRgb((h + 0.5) % 1, s, l)), // Complementary
        rgbToHex(...hslToRgb((h + 0.33) % 1, s, l)), // Triadic 1
        rgbToHex(...hslToRgb((h + 0.67) % 1, s, l)), // Triadic 2
        rgbToHex(...hslToRgb((h + 0.17) % 1, s, l)), // Analogous 1
        rgbToHex(...hslToRgb((h - 0.17 + 1) % 1, s, l)), // Analogous 2
      ];
      
      // Generate shades and tints
      const shadesAndTints = [
        rgbToHex(...hslToRgb(h, s, Math.max(0, l - 0.4))), // Darkest shade
        rgbToHex(...hslToRgb(h, s, Math.max(0, l - 0.25))), // Dark shade
        rgbToHex(...hslToRgb(h, s, Math.max(0, l - 0.1))), // Light shade
        baseColor, // Original
        rgbToHex(...hslToRgb(h, s, Math.min(1, l + 0.1))), // Light tint
        rgbToHex(...hslToRgb(h, s, Math.min(1, l + 0.25))), // Lighter tint
        rgbToHex(...hslToRgb(h, Math.max(0, s - 0.3), Math.min(1, l + 0.4))), // Lightest tint
      ];
      
      // Sample palette (theme-like)
      const palette = [
        rgbToHex(...hslToRgb(h, Math.min(1, s * 1.2), Math.max(0, l - 0.15))), // Primary
        rgbToHex(...hslToRgb((h + 0.05) % 1, Math.max(0, s - 0.2), Math.min(0.9, l + 0.1))), // Secondary
        rgbToHex(...hslToRgb((h + 0.02) % 1, Math.max(0, s - 0.4), Math.min(0.95, l + 0.25))), // Background
        rgbToHex(...hslToRgb(h, Math.min(1, s * 1.3), Math.max(0, l - 0.3))), // Header
        rgbToHex(...hslToRgb((h + 0.5) % 1, Math.min(1, s * 0.8), Math.max(0.1, l))), // Accent
      ];
      
      setHarmonies(harmonies);
      setShades(shadesAndTints);
      setPalette(palette);
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
        <TabsContent value="harmony" className="space-y-3 pt-2">
          <div className="grid grid-cols-2 gap-2">
            {harmonies.map((color, index) => (
              <div key={`harmony-${index}`} className="flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => onSelectColor(color)}
                  className="h-12 w-full rounded overflow-hidden border shadow-sm transition hover:scale-105 relative group"
                  style={{ backgroundColor: color }}
                >
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6 bg-white bg-opacity-80 hover:bg-opacity-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          copyToClipboard(color);
                        }}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6 bg-white bg-opacity-80 hover:bg-opacity-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          saveToCustomColors(color);
                        }}
                      >
                        <Palette className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </button>
                <span className="text-xs mt-1">{color}</span>
                <span className="text-xxs text-muted-foreground">
                  {index === 0 ? 'Base' : 
                   index === 1 ? 'Complementary' : 
                   index === 2 || index === 3 ? 'Triadic' : 'Analogous'}
                </span>
              </div>
            ))}
          </div>
          
          <div className="text-xs text-center text-muted-foreground">
            Click on a color to select it, or use the buttons to copy or save
          </div>
        </TabsContent>
        
        {/* Shades tab */}
        <TabsContent value="shades" className="space-y-3 pt-2">
          <div className="space-y-2">
            {shades.map((color, index) => (
              <div key={`shade-${index}`} className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onSelectColor(color)}
                  className="h-8 w-12 rounded overflow-hidden border shadow-sm transition hover:scale-105"
                  style={{ backgroundColor: color }}
                />
                <span className="text-xs flex-1">{color}</span>
                <span className="text-xs text-muted-foreground w-16">
                  {index < 3 ? `Shade ${3-index}` : 
                   index === 3 ? 'Base' : `Tint ${index-3}`}
                </span>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7"
                  onClick={() => copyToClipboard(color)}
                >
                  <Copy className="h-3 w-3" />
                </Button>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7"
                  onClick={() => saveToCustomColors(color)}
                >
                  <Palette className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </TabsContent>
        
        {/* Palette tab */}
        <TabsContent value="palette" className="space-y-3 pt-2">
          <div className="space-y-2">
            {palette.map((color, index) => (
              <div key={`palette-${index}`} className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onSelectColor(color)}
                  className="h-8 w-12 rounded overflow-hidden border shadow-sm transition hover:scale-105"
                  style={{ backgroundColor: color }}
                />
                <span className="text-xs flex-1">{color}</span>
                <span className="text-xs text-muted-foreground w-16">
                  {index === 0 ? 'Primary' : 
                   index === 1 ? 'Secondary' : 
                   index === 2 ? 'Background' : 
                   index === 3 ? 'Header' : 'Accent'}
                </span>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7"
                  onClick={() => copyToClipboard(color)}
                >
                  <Copy className="h-3 w-3" />
                </Button>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7"
                  onClick={() => saveToCustomColors(color)}
                >
                  <Palette className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
          
          <Button
            onClick={() => {
              onSelectColor(palette[0]); // Primary
              toast.success("Primary color selected");
            }}
            variant="outline"
            size="sm"
            className="w-full mt-2"
          >
            Apply This Palette Theme
          </Button>
        </TabsContent>
      </Tabs>
      
      {/* Custom colors section */}
      {customColors.length > 0 && (
        <div className="pt-2 border-t border-border">
          <Label className="text-xs mb-2">Saved Colors</Label>
          <div className="grid grid-cols-6 gap-1">
            {customColors.map((color, index) => (
              <button
                key={`custom-${index}`}
                type="button"
                onClick={() => onSelectColor(color)}
                className="h-6 w-6 rounded-full overflow-hidden border shadow-sm transition hover:scale-110"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorChart;
