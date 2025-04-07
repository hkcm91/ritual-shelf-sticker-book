import React, { useState, useEffect, useRef } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Copy, Save, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import PaletteTab from './color-chart/PaletteTab';
import ShadesTab from './color-chart/ShadesTab';
import HarmonyTab from './color-chart/HarmonyTab';
import SavedColors from './color-chart/SavedColors';
import { 
  generateShadesAndTints, 
  generateHarmonies, 
  hexToRgb, 
  rgbToHex,
  rgbToHsl,
  hslToRgb
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
  const [activeTab, setActiveTab] = useState("picker");
  const [hsv, setHsv] = useState({ h: 0, s: 100, v: 100 });
  const [shades, setShades] = useState<string[]>([]);
  const [harmonies, setHarmonies] = useState<string[]>([]);
  
  const satValCanvasRef = useRef<HTMLCanvasElement>(null);
  const hueSliderRef = useRef<HTMLCanvasElement>(null);
  const pickerDragAreaRef = useRef<HTMLDivElement>(null);
  const hueSliderDragAreaRef = useRef<HTMLDivElement>(null);
  const satValThumbRef = useRef<HTMLDivElement>(null);
  const hueThumbRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const isHueDraggingRef = useRef(false);

  const hexToHsv = (hex: string): { h: number, s: number, v: number } => {
    const rgb = hexToRgb(hex);
    if (!rgb) return { h: 0, s: 0, v: 0 };
    
    const [r, g, b] = rgb;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;
    
    let h = 0;
    if (delta !== 0) {
      if (max === r) {
        h = ((g - b) / delta) % 6;
      } else if (max === g) {
        h = (b - r) / delta + 2;
      } else {
        h = (r - g) / delta + 4;
      }
    }
    
    h = Math.round(h * 60);
    if (h < 0) h += 360;
    
    const s = max === 0 ? 0 : Math.round((delta / max) * 100);
    const v = Math.round((max / 255) * 100);
    
    return { h, s, v };
  };

  const hsvToHex = (hsv: { h: number, s: number, v: number }): string => {
    const { h, s, v } = hsv;
    const hi = Math.floor(h / 60) % 6;
    const f = h / 60 - Math.floor(h / 60);
    const value = v * 255 / 100;
    const p = (v * (1 - s / 100)) * 255 / 100;
    const q = (v * (1 - f * s / 100)) * 255 / 100;
    const t = (v * (1 - (1 - f) * s / 100)) * 255 / 100;
    
    let r = 0, g = 0, b = 0;
    
    switch (hi) {
      case 0: r = value; g = t; b = p; break;
      case 1: r = q; g = value; b = p; break;
      case 2: r = p; g = value; b = t; break;
      case 3: r = p; g = q; b = value; break;
      case 4: r = t; g = p; b = value; break;
      case 5: r = value; g = p; b = q; break;
    }
    
    return rgbToHex(Math.round(r), Math.round(g), Math.round(b));
  };

  const generateShades = (color: string, count: number): string[] => {
    return generateShadesAndTints(color);
  };

  useEffect(() => {
    const savedColors = localStorage.getItem('customColors');
    if (savedColors) {
      setCustomColors(JSON.parse(savedColors));
    }
  }, []);

  useEffect(() => {
    if (color !== currentColor) {
      setCurrentColor(color);
      setInputColor(color);
      setHsv(hexToHsv(color));
    }
  }, [color]);

  useEffect(() => {
    const hex = hsvToHex(hsv);
    setCurrentColor(hex);
    setInputColor(hex);
    setShades(generateShades(hex, 7));
    setHarmonies(generateHarmonies(hex));
  }, [hsv]);

  useEffect(() => {
    renderSatValCanvas();
    renderHueSlider();
    positionThumbs();
  }, [hsv]);

  const renderSatValCanvas = () => {
    const canvas = satValCanvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const width = canvas.width;
    const height = canvas.height;
    
    const satGradient = ctx.createLinearGradient(0, 0, width, 0);
    satGradient.addColorStop(0, `hsl(${hsv.h}, 0%, 100%)`);
    satGradient.addColorStop(1, `hsl(${hsv.h}, 100%, 50%)`);
    
    ctx.fillStyle = satGradient;
    ctx.fillRect(0, 0, width, height);
    
    const valGradient = ctx.createLinearGradient(0, 0, 0, height);
    valGradient.addColorStop(0, `rgba(255, 255, 255, 0)`);
    valGradient.addColorStop(1, `rgba(0, 0, 0, 1)`);
    
    ctx.fillStyle = valGradient;
    ctx.fillRect(0, 0, width, height);
  };

  const renderHueSlider = () => {
    const canvas = hueSliderRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const width = canvas.width;
    const height = canvas.height;
    
    const gradient = ctx.createLinearGradient(0, 0, width, 0);
    for (let i = 0; i <= 6; i++) {
      gradient.addColorStop(i / 6, `hsl(${i * 60}, 100%, 50%)`);
    }
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  };

  const positionThumbs = () => {
    if (!satValCanvasRef.current || !hueSliderRef.current || 
        !satValThumbRef.current || !hueThumbRef.current) return;
    
    const satValWidth = satValCanvasRef.current.width;
    const satValHeight = satValCanvasRef.current.height;
    const hueWidth = hueSliderRef.current.width;
    
    const satX = (hsv.s / 100) * satValWidth;
    const valY = (1 - hsv.v / 100) * satValHeight;
    satValThumbRef.current.style.left = `${satX}px`;
    satValThumbRef.current.style.top = `${valY}px`;
    
    const hueX = (hsv.h / 360) * hueWidth;
    hueThumbRef.current.style.left = `${hueX}px`;
  };

  const handleSatValMouseDown = (e: React.MouseEvent) => {
    if (!pickerDragAreaRef.current || !satValCanvasRef.current) return;
    
    isDraggingRef.current = true;
    updateSaturationValue(e);
    
    document.addEventListener('mousemove', handleSatValMouseMove);
    document.addEventListener('mouseup', handleSatValMouseUp);
  };

  const handleSatValMouseMove = (e: MouseEvent) => {
    if (!isDraggingRef.current) return;
    updateSaturationValue(e);
  };

  const handleSatValMouseUp = () => {
    isDraggingRef.current = false;
    document.removeEventListener('mousemove', handleSatValMouseMove);
    document.removeEventListener('mouseup', handleSatValMouseUp);
    onChange(currentColor);
  };

  const updateSaturationValue = (e: MouseEvent | React.MouseEvent) => {
    if (!pickerDragAreaRef.current || !satValCanvasRef.current) return;
    
    const rect = pickerDragAreaRef.current.getBoundingClientRect();
    const canvasWidth = satValCanvasRef.current.width;
    const canvasHeight = satValCanvasRef.current.height;
    
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    
    x = Math.max(0, Math.min(canvasWidth, x));
    y = Math.max(0, Math.min(canvasHeight, y));
    
    const s = (x / canvasWidth) * 100;
    const v = (1 - y / canvasHeight) * 100;
    
    setHsv(prev => ({ ...prev, s, v }));
  };

  const handleHueMouseDown = (e: React.MouseEvent) => {
    if (!hueSliderDragAreaRef.current || !hueSliderRef.current) return;
    
    isHueDraggingRef.current = true;
    updateHue(e);
    
    document.addEventListener('mousemove', handleHueMouseMove);
    document.addEventListener('mouseup', handleHueMouseUp);
  };

  const handleHueMouseMove = (e: MouseEvent) => {
    if (!isHueDraggingRef.current) return;
    updateHue(e);
  };

  const handleHueMouseUp = () => {
    isHueDraggingRef.current = false;
    document.removeEventListener('mousemove', handleHueMouseMove);
    document.removeEventListener('mouseup', handleHueMouseUp);
    onChange(currentColor);
  };

  const updateHue = (e: MouseEvent | React.MouseEvent) => {
    if (!hueSliderDragAreaRef.current || !hueSliderRef.current) return;
    
    const rect = hueSliderDragAreaRef.current.getBoundingClientRect();
    const sliderWidth = hueSliderRef.current.width;
    
    let x = e.clientX - rect.left;
    
    x = Math.max(0, Math.min(sliderWidth, x));
    
    const h = (x / sliderWidth) * 360;
    
    setHsv(prev => ({ ...prev, h }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputColor(value);
    
    if (/^#[0-9A-F]{6}$/i.test(value)) {
      setCurrentColor(value);
      setHsv(hexToHsv(value));
    }
  };

  const handleSelectColor = (selectedColor: string) => {
    setCurrentColor(selectedColor);
    setInputColor(selectedColor);
    setHsv(hexToHsv(selectedColor));
    onChange(selectedColor);
  };

  const handleCopyColor = (colorToCopy: string) => {
    navigator.clipboard.writeText(colorToCopy);
    toast.success(`Copied ${colorToCopy} to clipboard`);
  };

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

  const handleRandomColor = () => {
    const h = Math.floor(Math.random() * 360);
    const s = Math.floor(Math.random() * 30) + 70;
    const v = Math.floor(Math.random() * 30) + 70;
    setHsv({ h, s, v });
  };

  return (
    <div className="color-chart w-full p-1 shadow-lg rounded-md">
      <div className="color-picker-section mb-4 border rounded-lg p-3">
        <div className="flex items-center mb-3 gap-2">
          <div 
            className="w-8 h-8 rounded border"
            style={{ backgroundColor: currentColor }}
          />
          <div className="flex-1">
            <Input
              type="text"
              value={inputColor}
              onChange={handleInputChange}
              className="font-mono"
              maxLength={7}
            />
          </div>
          <Button 
            onClick={() => handleCopyColor(currentColor)} 
            size="icon" 
            variant="outline"
            className="h-8 w-8"
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button 
            onClick={() => handleSaveColor(currentColor)} 
            size="icon" 
            variant="outline"
            className="h-8 w-8"
          >
            <Save className="h-4 w-4" />
          </Button>
          <Button 
            onClick={handleRandomColor} 
            size="icon" 
            variant="outline"
            className="h-8 w-8"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>

        <div className="relative w-full rounded overflow-hidden mb-2">
          <canvas 
            ref={satValCanvasRef}
            width={300}
            height={150}
            className="w-full h-[150px]"
          />
          <div 
            ref={pickerDragAreaRef}
            className="absolute inset-0 cursor-crosshair"
            onMouseDown={handleSatValMouseDown}
          />
          <div 
            ref={satValThumbRef}
            className="absolute w-4 h-4 rounded-full border-2 border-white shadow-md transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            style={{ 
              backgroundColor: currentColor,
              boxShadow: '0 0 0 1px rgba(0,0,0,0.2)'
            }}
          />
        </div>

        <div className="relative w-full h-8 rounded overflow-hidden">
          <canvas 
            ref={hueSliderRef}
            width={300}
            height={20}
            className="w-full h-full"
          />
          <div 
            ref={hueSliderDragAreaRef}
            className="absolute inset-0 cursor-ew-resize"
            onMouseDown={handleHueMouseDown}
          />
          <div 
            ref={hueThumbRef}
            className="absolute top-0 bottom-0 w-1 bg-white border border-gray-400 shadow-md transform -translate-x-1/2 pointer-events-none"
          />
        </div>
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

const generatePalette = (baseColor: string): string[] => {
  const rgb = hexToRgb(baseColor);
  if (!rgb) return [baseColor, baseColor, baseColor, baseColor, baseColor];
  
  const [h, s, l] = rgbToHsl(...rgb);
  
  return [
    rgbToHex(...hslToRgb(h, Math.min(1, s * 1.2), Math.max(0, l - 0.15))),
    rgbToHex(...hslToRgb((h + 0.05) % 1, Math.max(0, s - 0.2), Math.min(0.9, l + 0.1))),
    rgbToHex(...hslToRgb((h + 0.02) % 1, Math.max(0, s - 0.4), Math.min(0.95, l + 0.25))),
    rgbToHex(...hslToRgb(h, Math.min(1, s * 1.3), Math.max(0, l - 0.3))),
    rgbToHex(...hslToRgb((h + 0.5) % 1, Math.min(1, s * 0.8), Math.max(0.1, l))),
  ];
};

export default ColorChart;
