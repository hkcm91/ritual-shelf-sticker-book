
import React from 'react';
import CollapsibleSection from "../../common/CollapsibleSection";

interface HeaderPreviewSectionProps {
  background: string;
  backgroundImage: string;
  textColor: string;
  isCollapsed: boolean;
  onToggle: () => void;
}

const HeaderPreviewSection: React.FC<HeaderPreviewSectionProps> = ({
  background,
  backgroundImage,
  textColor,
  isCollapsed,
  onToggle
}) => {
  return (
    <CollapsibleSection
      title="Preview"
      isCollapsed={isCollapsed}
      onToggle={onToggle}
      borderBottom={false}
    >
      <div 
        className="h-12 rounded-md flex items-center px-4 transition-all"
        style={{
          backgroundColor: background,
          backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
          color: textColor,
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}
      >
        <span className="font-medium">Sample Header Text</span>
      </div>
    </CollapsibleSection>
  );
};

export default HeaderPreviewSection;
