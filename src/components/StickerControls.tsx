
import React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { RotateCcw, RotateCw, Trash2, ZoomIn, ZoomOut, RefreshCw } from 'lucide-react';
import { PopoverContent, PopoverArrow } from '@/components/ui/popover';

type StickerControlsProps = {
  scale: number;
  onScaleChange: (scale: number) => void;
  onRotate: (direction: 'cw' | 'ccw') => void;
  onResetTransform: () => void;
  onShowDeleteDialog: () => void;
  opacity?: number;
  onOpacityChange?: (opacity: number) => void;
  isLottie?: boolean;
};

const StickerControls: React.FC<StickerControlsProps> = ({
  scale,
  onScaleChange,
  onRotate,
  onResetTransform,
  onShowDeleteDialog,
  opacity = 1,
  onOpacityChange,
  isLottie = false
}) => {
  return (
    <PopoverContent className="w-72 p-4" side="top">
      <div className="space-y-4">
        <h4 className="font-medium">Item Controls</h4>
        
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Scale</span>
          <div className="flex items-center space-x-2">
            <Button 
              size="sm" 
              variant="outline" 
              className="h-6 w-6"
              onClick={() => onScaleChange(Math.max(0.5, scale - 0.1))}
              disabled={isLottie}
            >
              <ZoomOut className="h-3.5 w-3.5" />
            </Button>
            <span className="text-xs w-8 text-center">
              {Math.round(scale * 100)}%
            </span>
            <Button 
              size="sm" 
              variant="outline"
              className="h-6 w-6" 
              onClick={() => onScaleChange(Math.min(3, scale + 0.1))}
              disabled={isLottie}
            >
              <ZoomIn className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
        
        {!isLottie && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Size</span>
              <div className="flex-1 mx-4">
                <Slider
                  value={[scale * 100]}
                  min={50}
                  max={300}
                  step={5}
                  onValueChange={(value) => onScaleChange(value[0] / 100)}
                />
              </div>
            </div>
          </div>
        )}
        
        {onOpacityChange && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Opacity</span>
              <span className="text-xs w-8 text-center">
                {Math.round(opacity * 100)}%
              </span>
            </div>
            <Slider
              value={[opacity * 100]}
              min={0}
              max={100}
              step={5}
              onValueChange={(value) => onOpacityChange(value[0] / 100)}
            />
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Rotation</span>
          <div className="flex space-x-1">
            <Button size="sm" variant="outline" className="h-7 w-7" onClick={() => onRotate('ccw')}>
              <RotateCcw className="h-3.5 w-3.5" />
            </Button>
            <Button size="sm" variant="outline" className="h-7 w-7" onClick={() => onRotate('cw')}>
              <RotateCw className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2 pt-2">
          <Button size="sm" variant="outline" onClick={onResetTransform}>
            <RefreshCw className="h-3.5 w-3.5 mr-1" /> Reset
          </Button>
          <Button size="sm" variant="destructive" onClick={onShowDeleteDialog}>
            <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete
          </Button>
        </div>
      </div>
      <PopoverArrow className="fill-background" />
    </PopoverContent>
  );
};

export default StickerControls;
