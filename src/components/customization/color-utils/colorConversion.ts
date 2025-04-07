
// Color conversion utility functions

export const hexToRgb = (hex: string): [number, number, number] | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
  ] : null;
};

export const rgbToHex = (r: number, g: number, b: number): string => {
  return '#' + [r, g, b].map(x => {
    const hex = Math.max(0, Math.min(255, Math.round(x))).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
};

// RGB to HSL conversion
export const rgbToHsl = (r: number, g: number, b: number): [number, number, number] => {
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
export const hslToRgb = (h: number, s: number, l: number): [number, number, number] => {
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

// Generate color harmonies
export const generateHarmonies = (baseColor: string): string[] => {
  const rgb = hexToRgb(baseColor);
  if (!rgb) return [baseColor, baseColor, baseColor, baseColor, baseColor, baseColor];
  
  const [h, s, l] = rgbToHsl(...rgb);
  
  return [
    baseColor, // Original
    rgbToHex(...hslToRgb((h + 0.5) % 1, s, l)), // Complementary
    rgbToHex(...hslToRgb((h + 0.33) % 1, s, l)), // Triadic 1
    rgbToHex(...hslToRgb((h + 0.67) % 1, s, l)), // Triadic 2
    rgbToHex(...hslToRgb((h + 0.17) % 1, s, l)), // Analogous 1
    rgbToHex(...hslToRgb((h - 0.17 + 1) % 1, s, l)), // Analogous 2
  ];
};

// Generate shades and tints
export const generateShadesAndTints = (baseColor: string): string[] => {
  const rgb = hexToRgb(baseColor);
  if (!rgb) return [baseColor, baseColor, baseColor, baseColor, baseColor, baseColor, baseColor];
  
  const [h, s, l] = rgbToHsl(...rgb);
  
  return [
    rgbToHex(...hslToRgb(h, s, Math.max(0, l - 0.4))), // Darkest shade
    rgbToHex(...hslToRgb(h, s, Math.max(0, l - 0.25))), // Dark shade
    rgbToHex(...hslToRgb(h, s, Math.max(0, l - 0.1))), // Light shade
    baseColor, // Original
    rgbToHex(...hslToRgb(h, s, Math.min(1, l + 0.1))), // Light tint
    rgbToHex(...hslToRgb(h, s, Math.min(1, l + 0.25))), // Lighter tint
    rgbToHex(...hslToRgb(h, Math.max(0, s - 0.3), Math.min(1, l + 0.4))), // Lightest tint
  ];
};

// Generate palette (theme-like)
export const generatePalette = (baseColor: string): string[] => {
  const rgb = hexToRgb(baseColor);
  if (!rgb) return [baseColor, baseColor, baseColor, baseColor, baseColor];
  
  const [h, s, l] = rgbToHsl(...rgb);
  
  return [
    rgbToHex(...hslToRgb(h, Math.min(1, s * 1.2), Math.max(0, l - 0.15))), // Primary
    rgbToHex(...hslToRgb((h + 0.05) % 1, Math.max(0, s - 0.2), Math.min(0.9, l + 0.1))), // Secondary
    rgbToHex(...hslToRgb((h + 0.02) % 1, Math.max(0, s - 0.4), Math.min(0.95, l + 0.25))), // Background
    rgbToHex(...hslToRgb(h, Math.min(1, s * 1.3), Math.max(0, l - 0.3))), // Header
    rgbToHex(...hslToRgb((h + 0.5) % 1, Math.min(1, s * 0.8), Math.max(0.1, l))), // Accent
  ];
};
