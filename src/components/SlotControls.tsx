
import React from 'react';
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { FileImage } from 'lucide-react';

type SlotControlsProps = {
  onShowBgImageDialog: () => void;
  onSlotTypeChange: (type: 'book' | 'sticker') => void;
  slotType: 'book' | 'sticker';
};

const SlotControls: React.FC<SlotControlsProps> = ({ 
  onShowBgImageDialog, 
  onSlotTypeChange,
  slotType 
}) => {
  return (
    <>
      {/* Background customization hint */}
      <div className="absolute top-2 right-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 bg-black/30 hover:bg-black/50 text-white/70 opacity-40 hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation();
                  onShowBgImageDialog();
                }}
              >
                <FileImage className="h-3 w-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Set background image</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      {/* Slot type toggle with circles */}
      <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-3 opacity-60 hover:opacity-100">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div 
                className={`h-2.5 w-2.5 rounded-full cursor-pointer transition-all duration-200 ${slotType === 'book' ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/70'}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onSlotTypeChange('book');
                }}
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>Book Slot</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div 
                className={`h-2.5 w-2.5 rounded-full cursor-pointer transition-all duration-200 ${slotType === 'sticker' ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/70'}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onSlotTypeChange('sticker');
                }}
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>Sticker Slot (supports Lottie files)</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </>
  );
};

export default SlotControls;
