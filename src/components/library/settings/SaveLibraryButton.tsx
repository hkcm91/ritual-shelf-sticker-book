
import React from 'react';
import { Button } from '@/components/ui/button';
import { getButtonGradient } from './ThemedUtils';
import { ShelfData } from '@/store/types';

interface SaveLibraryButtonProps {
  currentLibrary: ShelfData | null;
  onClick: () => void;
  label?: string;
  className?: string;
}

const SaveLibraryButton: React.FC<SaveLibraryButtonProps> = ({
  currentLibrary,
  onClick,
  label = 'Save Library Name',
  className = 'w-full',
}) => {
  const buttonGradient = getButtonGradient(currentLibrary);
  
  return (
    <Button 
      onClick={onClick}
      className={`${className} bg-gradient-to-b ${buttonGradient} text-white hover:brightness-110 transition-all duration-300`}
    >
      {label}
    </Button>
  );
};

export default SaveLibraryButton;
