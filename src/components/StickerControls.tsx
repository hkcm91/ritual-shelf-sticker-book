
import React from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw, RotateCw, Image, Link, Trash2 } from 'lucide-react';
import { PopoverContent, PopoverArrow } from '@/components/ui/popover';

type StickerControlsProps = {
  scale: number;
  onScaleChange: (scale: number) => void;
  onRotate: (direction: 'cw' | 'ccw') => void;
  onResetTransform: () => void;
  onReplaceImage: () => void;
  onShowUrlDialog: () => void;
  onShowDeleteDialog: () => void;
};

const StickerControls: React.FC<StickerControlsProps> = ({
  scale,
  onScaleChange,
  onRotate,
  onResetTransform,
  onReplaceImage,
  onShowUrlDialog,
  onShowDeleteDialog
}) => {
  return (
    <PopoverContent className="w-64" side="top">
      <div className="space-y-2">
        <h4 className="font-medium">Sticker Controls</h4>
        <div className="flex justify-between items-center">
          <span>Scale: {scale.toFixed(1)}x</span>
          <div className="flex items-center space-x-1">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => onScaleChange(Math.max(0.5, scale - 0.1))}
              disabled={scale <= 0.5}
            >
              -
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => onScaleChange(Math.min(3, scale + 0.1))}
              disabled={scale >= 3}
            >
              +
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span>Rotation</span>
          <div className="flex items-center space-x-1">
            <Button size="sm" variant="outline" onClick={() => onRotate('ccw')}>
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline" onClick={() => onRotate('cw')}>
              <RotateCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 pt-2">
          <Button size="sm" variant="outline" onClick={onResetTransform}>
            Reset
          </Button>
          <Button size="sm" variant="outline" onClick={onReplaceImage}>
            <Image className="h-4 w-4 mr-1" />
            Replace
          </Button>
          <Button size="sm" variant="outline" onClick={onShowUrlDialog}>
            <Link className="h-4 w-4 mr-1" />
            URL
          </Button>
          <Button size="sm" variant="destructive" onClick={onShowDeleteDialog}>
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </div>
      </div>
      <PopoverArrow className="fill-background" />
    </PopoverContent>
  );
};

export default StickerControls;
