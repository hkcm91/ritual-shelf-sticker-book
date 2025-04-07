
import React, { useRef, useEffect } from 'react';

interface ColorPickerCanvasProps {
  hue: number;
  saturation: number;
  value: number;
  onSaturationValueChange: (saturation: number, value: number) => void;
}

const ColorPickerCanvas: React.FC<ColorPickerCanvasProps> = ({
  hue,
  saturation,
  value,
  onSaturationValueChange
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dragAreaRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  
  // Render the saturation-value canvas
  const renderCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const width = canvas.width;
    const height = canvas.height;
    
    // Create saturation gradient (white to pure hue)
    const satGradient = ctx.createLinearGradient(0, 0, width, 0);
    satGradient.addColorStop(0, `hsl(${hue}, 0%, 100%)`);
    satGradient.addColorStop(1, `hsl(${hue}, 100%, 50%)`);
    
    ctx.fillStyle = satGradient;
    ctx.fillRect(0, 0, width, height);
    
    // Create value gradient (transparent to black)
    const valGradient = ctx.createLinearGradient(0, 0, 0, height);
    valGradient.addColorStop(0, `rgba(255, 255, 255, 0)`);
    valGradient.addColorStop(1, `rgba(0, 0, 0, 1)`);
    
    ctx.fillStyle = valGradient;
    ctx.fillRect(0, 0, width, height);
  };

  // Position thumb based on current saturation and value
  const positionThumb = () => {
    if (!canvasRef.current || !thumbRef.current) return;
    
    const width = canvasRef.current.width;
    const height = canvasRef.current.height;
    
    const satX = (saturation / 100) * width;
    const valY = (1 - value / 100) * height;
    
    thumbRef.current.style.left = `${satX}px`;
    thumbRef.current.style.top = `${valY}px`;
  };

  // Handle mouse events for the picker
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!dragAreaRef.current || !canvasRef.current) return;
    
    isDraggingRef.current = true;
    updateSaturationValue(e);
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDraggingRef.current) return;
    updateSaturationValue(e);
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  // Calculate and update saturation and value based on mouse position
  const updateSaturationValue = (e: MouseEvent | React.MouseEvent) => {
    if (!dragAreaRef.current || !canvasRef.current) return;
    
    const rect = dragAreaRef.current.getBoundingClientRect();
    const canvasWidth = canvasRef.current.width;
    const canvasHeight = canvasRef.current.height;
    
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    
    x = Math.max(0, Math.min(canvasWidth, x));
    y = Math.max(0, Math.min(canvasHeight, y));
    
    const newSaturation = (x / canvasWidth) * 100;
    const newValue = (1 - y / canvasHeight) * 100;
    
    onSaturationValueChange(newSaturation, newValue);
  };

  // Render the canvas when hue changes
  useEffect(() => {
    renderCanvas();
    positionThumb();
  }, [hue, saturation, value]);

  // Clean up event listeners
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <div className="relative w-full rounded overflow-hidden mb-2">
      <canvas 
        ref={canvasRef}
        width={300}
        height={150}
        className="w-full h-[150px]"
      />
      <div 
        ref={dragAreaRef}
        className="absolute inset-0 cursor-crosshair"
        onMouseDown={handleMouseDown}
      />
      <div 
        ref={thumbRef}
        className="absolute w-4 h-4 rounded-full border-2 border-white shadow-md transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{ 
          backgroundColor: `hsl(${hue}, ${saturation}%, ${value / 2}%)`,
          boxShadow: '0 0 0 1px rgba(0,0,0,0.2)'
        }}
      />
    </div>
  );
};

export default ColorPickerCanvas;
