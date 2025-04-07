
import React from 'react';
import { Paintbrush } from "lucide-react";
import ColorPicker from "../../ColorPicker";
import CollapsibleSection from "../../common/CollapsibleSection";

interface HeaderTextColorSectionProps {
  textColor: string;
  onColorChange: (color: string) => void;
  isCollapsed: boolean;
  onToggle: () => void;
}

const HeaderTextColorSection: React.FC<HeaderTextColorSectionProps> = ({
  textColor,
  onColorChange,
  isCollapsed,
  onToggle
}) => {
  // Color preview element for the section header
  const colorPreview = (
    <div 
      className="h-5 w-5 rounded-full border"
      style={{ backgroundColor: textColor }}
    />
  );

  return (
    <CollapsibleSection
      title="Text Color"
      icon={Paintbrush}
      isCollapsed={isCollapsed}
      onToggle={onToggle}
      rightElement={colorPreview}
    >
      <ColorPicker 
        color={textColor} 
        onChange={(color) => onColorChange(color)} 
      />
    </CollapsibleSection>
  );
};

export default HeaderTextColorSection;
