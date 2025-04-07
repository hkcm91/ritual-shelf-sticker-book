
/**
 * Calculates the brightness of a hex color
 * Returns a value between 0-255
 */
export function calculateColorBrightness(hexColor: string): number {
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000;
}

/**
 * Safely applies a CSS variable to the document root
 */
export function setCssVariable(name: string, value: string | number): void {
  if (name && value !== undefined && value !== null) {
    document.documentElement.style.setProperty(name, value.toString());
  }
}
