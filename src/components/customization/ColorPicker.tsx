
import React, { useState, useEffect } from 'react';
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { PipetteIcon, Circle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  disabled?: boolean;
  allowAlpha?: boolean;
}

// Predefined color palette
const presetColors = [
  // Pastels
  '#FFB6C1', '#FFFACD', '#F0FFF0', '#E5DEFF', '#FFDEE2', '#FDE1D3', 
  // Vibrant
  '#8B5CF6', '#D946EF', '#F97316', '#0EA5E9', '#a83052', '#355e3b',
  // Woods
  '#8B5A2B', '#A47148', '#D2B48C', '#AEC6CF', '#8c2f39', '#2e4600',
  // Neutrals
  '#333333', '#555555', '#FFFFFF', '#F5F5F5', '#000000', '#88888',
];

// Convert hex to RGB
const hexToRgb = (hex: string): [number, number, number] | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
  ] : null;
};

// Convert RGB to hex
const rgbToHex = (r: number, g: number, b: number): string => {
  return '#' + [r, g, b].map(x => {
    const hex = Math.max(0, Math.min(255, Math.round(x))).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
};

// Parse any color string to get RGB values
const parseColorString = (color: string): [number, number, number, number] => {
  if (color.startsWith('#')) {
    const rgb = hexToRgb(color);
    return rgb ? [...rgb, 1] : [0, 0, 0, 1];
  } else if (color.startsWith('rgba')) {
    const match = color.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
    if (match) {
      return [
        parseInt(match[1], 10),
        parseInt(match[2], 10),
        parseInt(match[3], 10),
        parseFloat(match[4])
      ];
    }
  } else if (color.startsWith('rgb')) {
    const match = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (match) {
      return [
        parseInt(match[1], 10),
        parseInt(match[2], 10),
        parseInt(match[3], 10),
        1
      ];
    }
  }
  return [0, 0, 0, 1];
};

const ColorPicker: React.FC<ColorPickerProps> = ({ 
  color,
  onChange,
  disabled = false,
  allowAlpha = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentColor, setCurrentColor] = useState<string>(color);
  const [transparency, setTransparency] = useState<number>(1);
  
  // Update local state when props change
  useEffect(() => {
    setCurrentColor(color);
    
    if (allowAlpha && color.startsWith('rgba')) {
      const alphaMatch = color.match(/rgba\(\d+,\s*\d+,\s*\d+,\s*([\d.]+)/);
      if (alphaMatch) {
        setTransparency(parseFloat(alphaMatch[1]));
      }
    }
  }, [color, allowAlpha]);
  
  // Handle direct hex input
  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setCurrentColor(newColor);
    
    // Only propagate valid colors
    if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(newColor)) {
      if (allowAlpha && transparency < 1) {
        const [r, g, b] = parseColorString(newColor);
        onChange(`rgba(${r}, ${g}, ${b}, ${transparency})`);
      } else {
        onChange(newColor);
      }
    }
  };
  
  // Handle color input from color picker
  const handleColorPickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHex = e.target.value;
    setCurrentColor(newHex);
    
    if (allowAlpha && transparency < 1) {
      const [r, g, b] = parseColorString(newHex);
      onChange(`rgba(${r}, ${g}, ${b}, ${transparency})`);
    } else {
      onChange(newHex);
    }
  };
  
  // Handle alpha/transparency changes
  const handleTransparencyChange = (value: number[]) => {
    const newTransparency = value[0];
    setTransparency(newTransparency);
    
    const [r, g, b] = parseColorString(currentColor);
    onChange(`rgba(${r}, ${g}, ${b}, ${newTransparency})`);
  };
  
  // Select a preset color
  const handlePresetSelect = (presetColor: string) => {
    setCurrentColor(presetColor);
    
    if (allowAlpha && transparency < 1) {
      const [r, g, b] = parseColorString(presetColor);
      onChange(`rgba(${r}, ${g}, ${b}, ${transparency})`);
    } else {
      onChange(presetColor);
    }
  };
  
  // Clean color for display
  const displayColor = currentColor.startsWith('rgba') 
    ? rgbToHex(...parseColorString(currentColor).slice(0, 3) as [number, number, number])
    : currentColor;
  
  return (
    <Popover open={isOpen && !disabled} onOpenChange={setIsOpen}>
      <div className="flex gap-2 items-center">
        <PopoverTrigger asChild>
          <Button 
            type="button" 
            variant="outline" 
            className="w-12 h-8 p-1 border-2"
            style={{ backgroundColor: color }}
            disabled={disabled}
          />
        </PopoverTrigger>
        
        <Input
          type="text"
          value={color}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1"
          disabled={disabled}
        />
        
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => setIsOpen(true)}
          disabled={disabled}
        >
          <PipetteIcon className="h-4 w-4" />
        </Button>
      </div>
      
      <PopoverContent className="w-80 p-4">
        <div className="space-y-4">
          {/* Color visualization */}
          <div 
            className="h-24 rounded-md border shadow-inner"
            style={{ backgroundColor: color }}
          />
          
          {/* HEX input with color picker */}
          <div className="flex items-center gap-2">
            <Input
              type="text"
              value={displayColor}
              onChange={handleHexChange}
              className="flex-1"
              placeholder="#RRGGBB"
            />
            <div className="relative overflow-hidden rounded-md border w-12 h-8">
              <Input
                type="color"
                value={displayColor}
                onChange={handleColorPickerChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div 
                className="absolute inset-0 w-full h-full" 
                style={{ backgroundColor: displayColor }}
              />
            </div>
          </div>
          
          {/* Alpha slider (if enabled) */}
          {allowAlpha && (
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-xs font-medium">Transparency</span>
                <span className="text-xs">{Math.round(transparency * 100)}%</span>
              </div>
              <Slider
                min={0}
                max={1}
                step={0.01}
                value={[transparency]}
                onValueChange={handleTransparencyChange}
                className="w-full"
              />
              <div 
                className="h-2 w-full rounded-sm mt-1"
                style={{
                  backgroundImage: `linear-gradient(to right, rgba(255,255,255,0), ${displayColor})`
                }}
              />
            </div>
          )}
          
          {/* Color swatches */}
          <div className="space-y-2">
            <span className="text-xs font-medium">Preset Colors</span>
            <div className="grid grid-cols-6 gap-2">
              {presetColors.map((presetColor, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handlePresetSelect(presetColor)}
                  className={cn(
                    "relative h-6 w-6 rounded-full overflow-hidden border shadow-sm transition",
                    "hover:scale-110 hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
                  )}
                  style={{ backgroundColor: presetColor }}
                  title={presetColor}
                >
                  {currentColor.toLowerCase().includes(presetColor.toLowerCase()) && (
                    <CheckCircle2 className="h-4 w-4 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white drop-shadow" />
                  )}
                </button>
              ))}
            </div>
          </div>
          
          {/* Color harmony chart */}
          <ColorHarmonyChart baseColor={displayColor} onSelectColor={handlePresetSelect} />
        </div>
      </PopoverContent>
    </Popover>
  );
};

// Color harmony chart component
interface ColorHarmonyChartProps {
  baseColor: string;
  onSelectColor: (color: string) => void;
}

const ColorHarmonyChart: React.FC<ColorHarmonyChartProps> = ({ baseColor, onSelectColor }) => {
  // Generate complementary color
  const getComplementary = (hex: string): string => {
    const rgb = hexToRgb(hex);
    if (!rgb) return '#000000';
    return rgbToHex(255 - rgb[0], 255 - rgb[1], 255 - rgb[2]);
  };
  
  // Generate analogous colors (neighbors on the color wheel)
  const getAnalogous = (hex: string): string[] => {
    const rgb = hexToRgb(hex);
    if (!rgb) return ['#000000', '#000000'];
    
    // Convert to HSL to rotate hue
    let r = rgb[0] / 255;
    let g = rgb[1] / 255;
    let b = rgb[2] / 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;
    
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
      else if (max === g) h = (b - r) / d + 2;
      else h = (r - g) / d + 4;
      
      h /= 6;
    }
    
    // Rotate hue by 30 degrees in both directions
    const h1 = (h + 0.083) % 1; // +30 degrees
    const h2 = (h - 0.083 + 1) % 1; // -30 degrees
    
    // Convert back to RGB
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
    
    const rgb1 = hslToRgb(h1, s, l);
    const rgb2 = hslToRgb(h2, s, l);
    
    return [rgbToHex(...rgb1), rgbToHex(...rgb2)];
  };
  
  // Generate shades (darker) and tints (lighter)
  const getShades = (hex: string, count: number = 3): string[] => {
    const rgb = hexToRgb(hex);
    if (!rgb) return Array(count).fill('#000000');
    
    return Array.from({ length: count }, (_, i) => {
      const factor = 0.7 - (i * 0.2); // Darkening factor
      return rgbToHex(
        Math.round(rgb[0] * factor),
        Math.round(rgb[1] * factor),
        Math.round(rgb[2] * factor)
      );
    });
  };
  
  const getTints = (hex: string, count: number = 3): string[] => {
    const rgb = hexToRgb(hex);
    if (!rgb) return Array(count).fill('#FFFFFF');
    
    return Array.from({ length: count }, (_, i) => {
      const factor = 1 + (i * 0.2); // Lightening factor
      return rgbToHex(
        Math.min(255, Math.round(rgb[0] + (255 - rgb[0]) * (i + 1) / (count + 1))),
        Math.min(255, Math.round(rgb[1] + (255 - rgb[1]) * (i + 1) / (count + 1))),
        Math.min(255, Math.round(rgb[2] + (255 - rgb[2]) * (i + 1) / (count + 1)))
      );
    });
  };
  
  // Generate all harmony colors
  const complementary = getComplementary(baseColor);
  const [analogous1, analogous2] = getAnalogous(baseColor);
  const shades = getShades(baseColor, 2);
  const tints = getTints(baseColor, 2);
  
  return (
    <div className="space-y-2">
      <span className="text-xs font-medium">Color Harmony</span>
      
      <div className="grid grid-cols-3 gap-1">
        {/* Base color */}
        <div className="space-y-1">
          <div className="text-xxs text-center">Base</div>
          <button
            type="button"
            onClick={() => onSelectColor(baseColor)}
            className="h-6 w-full rounded overflow-hidden border shadow-sm transition hover:scale-105"
            style={{ backgroundColor: baseColor }}
            title="Base color"
          />
        </div>
        
        {/* Complementary */}
        <div className="space-y-1">
          <div className="text-xxs text-center">Complementary</div>
          <button
            type="button"
            onClick={() => onSelectColor(complementary)}
            className="h-6 w-full rounded overflow-hidden border shadow-sm transition hover:scale-105"
            style={{ backgroundColor: complementary }}
            title="Complementary color"
          />
        </div>
        
        {/* Analogous average */}
        <div className="space-y-1">
          <div className="text-xxs text-center">Analogous</div>
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => onSelectColor(analogous1)}
              className="h-6 flex-1 rounded overflow-hidden border shadow-sm transition hover:scale-105"
              style={{ backgroundColor: analogous1 }}
              title="Analogous color 1"
            />
            <button
              type="button"
              onClick={() => onSelectColor(analogous2)}
              className="h-6 flex-1 rounded overflow-hidden border shadow-sm transition hover:scale-105"
              style={{ backgroundColor: analogous2 }}
              title="Analogous color 2"
            />
          </div>
        </div>
        
        {/* Shades row */}
        <div className="col-span-3 space-y-1">
          <div className="text-xxs text-center">Shades & Tints</div>
          <div className="flex gap-1">
            {shades.map((shade, i) => (
              <button
                key={`shade-${i}`}
                type="button"
                onClick={() => onSelectColor(shade)}
                className="h-6 flex-1 rounded overflow-hidden border shadow-sm transition hover:scale-105"
                style={{ backgroundColor: shade }}
                title={`Shade ${i+1}`}
              />
            ))}
            <button
              type="button"
              onClick={() => onSelectColor(baseColor)}
              className="h-6 flex-1 rounded overflow-hidden border shadow-sm transition hover:scale-105"
              style={{ backgroundColor: baseColor }}
              title="Base color"
            />
            {tints.map((tint, i) => (
              <button
                key={`tint-${i}`}
                type="button"
                onClick={() => onSelectColor(tint)}
                className="h-6 flex-1 rounded overflow-hidden border shadow-sm transition hover:scale-105"
                style={{ backgroundColor: tint }}
                title={`Tint ${i+1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorPicker;
