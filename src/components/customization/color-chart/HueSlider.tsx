
import React, { useRef, useEffect } from 'react';

interface HueSliderProps {
  hue: number;
  onHueChange: (hue: number) => void;
}

const HueSlider: React.FC<HueSliderProps> = ({ hue, onHueChange }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dragAreaRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  
  // Render hue slider gradient
  const renderSlider = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const width = canvas.width;
    const height = canvas.height;
    
    // Create hue gradient (spectrum)
    const gradient = ctx.createLinearGradient(0, 0, width, 0);
    for (let i = 0; i <= 6; i++) {
      gradient.addColorStop(i / 6, `hsl(${i * 60}, 100%, 50%)`);
    }
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  };

  // Position the thumb based on current hue
  const positionThumb = () => {
    if (!canvasRef.current || !thumbRef.current) return;
    
    const width = canvasRef.current.width;
    const hueX = (hue / 360) * width;
    
    thumbRef.current.style.left = `${hueX}px`;
  };

  // Handle mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!dragAreaRef.current || !canvasRef.current) return;
    
    isDraggingRef.current = true;
    updateHue(e);
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDraggingRef.current) return;
    updateHue(e);
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  // Calculate and update hue based on mouse position
  const updateHue = (e: MouseEvent | React.MouseEvent) => {
    if (!dragAreaRef.current || !canvasRef.current) return;
    
    const rect = dragAreaRef.current.getBoundingClientRect();
    const sliderWidth = canvasRef.current.width;
    
    let x = e.clientX - rect.left;
    x = Math.max(0, Math.min(sliderWidth, x));
    
    const newHue = (x / sliderWidth) * 360;
    onHueChange(newHue);
  };

  // Initialize on mount and update on hue change
  useEffect(() => {
    renderSlider();
    positionThumb();
  }, [hue]);

  // Clean up event listeners
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <div className="relative w-full h-8 rounded overflow-hidden">
      <canvas 
        ref={canvasRef}
        width={300}
        height={20}
        className="w-full h-full"
      />
      <div 
        ref={dragAreaRef}
        className="absolute inset-0 cursor-ew-resize"
        onMouseDown={handleMouseDown}
      />
      <div 
        ref={thumbRef}
        className="absolute top-0 bottom-0 w-1 bg-white border border-gray-400 shadow-md transform -translate-x-1/2 pointer-events-none"
      />
    </div>
  );
};

export default HueSlider;
