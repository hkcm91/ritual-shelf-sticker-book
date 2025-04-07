
import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import CustomizationContent from '../CustomizationContent';
import { AnimatedChild } from '../animations/ModalAnimations';

const ContentSection: React.FC = () => {
  return (
    <AnimatedChild className="flex-1 min-h-0 relative">
      <ScrollArea className="h-full pr-1">
        <CustomizationContent />
      </ScrollArea>
    </AnimatedChild>
  );
};

export default ContentSection;
