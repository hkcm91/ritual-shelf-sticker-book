
import React from 'react';
import { Image } from "lucide-react";
import FileInputField from "../../FileInputField";
import CollapsibleSection from "../../common/CollapsibleSection";

interface HeaderImageSectionProps {
  backgroundImage: string;
  onImageChange: (url: string) => void;
  isCollapsed: boolean;
  onToggle: () => void;
}

const HeaderImageSection: React.FC<HeaderImageSectionProps> = ({
  backgroundImage,
  onImageChange,
  isCollapsed,
  onToggle
}) => {
  return (
    <CollapsibleSection
      title="Background Image"
      icon={Image}
      isCollapsed={isCollapsed}
      onToggle={onToggle}
    >
      <FileInputField
        value={backgroundImage}
        onChange={(url) => onImageChange(url)}
        placeholder="Enter image URL"
        uploadLabel="Upload Image"
      />
      
      {backgroundImage && (
        <div className="mt-2 p-2 border rounded-md">
          <img 
            src={backgroundImage} 
            alt="Header background" 
            className="h-12 w-full object-cover rounded-md"
          />
        </div>
      )}
    </CollapsibleSection>
  );
};

export default HeaderImageSection;
