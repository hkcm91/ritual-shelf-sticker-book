
import React from 'react';
import { 
  PopoverContent
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { 
  RotateCcw, 
  RotateCw, 
  RefreshCw, 
  Trash2, 
  ZoomIn, 
  ZoomOut 
} from 'lucide-react';

type SlotControlsProps = {
  scale: number;
  onScaleChange: (value: number) => void;
  onRotate: (direction: 'cw' | 'ccw') => void;
  onResetTransform: () => void;
  onShowDeleteDialog: () => void;
  isLottie?: boolean;
};

const SlotControls: React.FC<SlotControlsProps> = ({
  scale,
  onScaleChange,
  onRotate,
  onResetTransform,
  onShowDeleteDialog,
  isLottie = false
}) => {
  return (
    <PopoverContent className="w-72 p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Scale</span>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              className="h-6 w-6"
              onClick={() => onScaleChange(Math.max(0.5, scale - 0.1))}
            >
              <ZoomOut className="h-3.5 w-3.5" />
            </Button>
            <span className="text-xs w-8 text-center">
              {Math.round(scale * 100)}%
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-6 w-6"
              onClick={() => onScaleChange(Math.min(3, scale + 0.1))}
            >
              <ZoomIn className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
        
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
        
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Rotate</span>
          <div className="flex space-x-1">
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => onRotate('ccw')}
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => onRotate('cw')}
            >
              <RotateCw className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
        
        <div className="flex justify-between pt-2">
          <Button
            variant="outline"
            size="sm"
            className="text-xs h-8"
            onClick={onResetTransform}
          >
            <RefreshCw className="h-3.5 w-3.5 mr-1" /> Reset
          </Button>
          
          <Button
            variant="destructive"
            size="sm"
            className="text-xs h-8"
            onClick={onShowDeleteDialog}
          >
            <Trash2 className="h-3.5 w-3.5 mr-1" /> Remove
          </Button>
        </div>
      </div>
    </PopoverContent>
  );
};

export default SlotControls;
