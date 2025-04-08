
import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface StickerErrorStateProps {
  message?: string;
}

const StickerErrorState: React.FC<StickerErrorStateProps> = ({ 
  message = "Error loading sticker" 
}) => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full text-red-500 bg-red-50 rounded-md p-2">
      <AlertTriangle className="mb-1 h-5 w-5" />
      <p className="text-xs text-center">{message}</p>
    </div>
  );
};

export default StickerErrorState;
