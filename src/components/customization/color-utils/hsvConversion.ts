
import { hexToRgb, rgbToHex } from './colorConversion';

// Convert hex to HSV
export const hexToHsv = (hex: string): { h: number, s: number, v: number } => {
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

// Convert HSV to hex
export const hsvToHex = (hsv: { h: number, s: number, v: number }): string => {
  const { h, s, v } = hsv;
  const hi = Math.floor(h / 60) % 6;
  const f = h / 60 - Math.floor(h / 60);
  
  const initialP = v * (1 - s / 100);
  const initialQ = v * (1 - f * s / 100);
  const initialT = v * (1 - (1 - f) * s / 100);
  
  const scaledV = v * 255 / 100;
  const scaledP = initialP * 255 / 100;
  const scaledQ = initialQ * 255 / 100;
  const scaledT = initialT * 255 / 100;
  
  let r = 0, g = 0, b = 0;
  
  switch (hi) {
    case 0: r = scaledV; g = scaledT; b = scaledP; break;
    case 1: r = scaledQ; g = scaledV; b = scaledP; break;
    case 2: r = scaledP; g = scaledV; b = scaledT; break;
    case 3: r = scaledP; g = scaledQ; b = scaledV; break;
    case 4: r = scaledT; g = scaledP; b = scaledV; break;
    case 5: r = scaledV; g = scaledP; b = scaledQ; break;
  }
  
  return rgbToHex(Math.round(r), Math.round(g), Math.round(b));
};
