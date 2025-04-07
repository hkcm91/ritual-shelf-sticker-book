
import React from 'react';
import StickerControls from './StickerControls';
import { PopoverContent } from '@/components/ui/popover';

type SlotControlsProps = {
  scale: number;
  onScaleChange: (scale: number) => void;
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
  isLottie
}) => {
  return (
    <PopoverContent className="w-72 p-0" side="top">
      <StickerControls 
        scale={scale}
        onScaleChange={onScaleChange}
        onRotate={onRotate}
        onResetTransform={onResetTransform}
        onShowDeleteDialog={onShowDeleteDialog}
        isLottie={isLottie}
      />
    </PopoverContent>
  );
};

export default SlotControls;
