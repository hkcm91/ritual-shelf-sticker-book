
import React from 'react';
import { Image, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import FileInputField from "../../FileInputField";
import CollapsibleSection from "../../common/CollapsibleSection";

interface BackgroundImageSectionProps {
  backgroundImage: string;
  onImageChange: (url: string) => void;
  isCollapsed: boolean;
  onToggle: () => void;
  isUploading: boolean;
  setIsUploading: React.Dispatch<React.SetStateAction<boolean>>;
}

const BackgroundImageSection: React.FC<BackgroundImageSectionProps> = ({
  backgroundImage,
  onImageChange,
  isCollapsed,
  onToggle,
  isUploading,
  setIsUploading
}) => {
  const handleRemoveImage = () => {
    onImageChange("");
  };

  return (
    <CollapsibleSection
      title="Background Image"
      icon={Image}
      isCollapsed={isCollapsed}
      onToggle={onToggle}
    >
      <FileInputField
        value={backgroundImage || ''} 
        onChange={onImageChange}
        placeholder="Enter image URL"
        uploadLabel="Upload Image"
        isLoading={isUploading}
        setIsLoading={setIsUploading}
        accept="image/*"
      />
      
      <div className="flex justify-between items-center">
        <p className="text-xs text-muted-foreground">
          Image will be applied as background to the entire page
        </p>
        {backgroundImage && (
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={handleRemoveImage}
            className="h-7 text-xs"
          >
            <Trash2 className="h-3 w-3 mr-1" />
            Remove
          </Button>
        )}
      </div>
      
      {backgroundImage && (
        <div className="rounded-md border overflow-hidden h-32 bg-center bg-no-repeat mt-2" 
          style={{
            backgroundImage: `url(${backgroundImage})`, 
            backgroundSize: 'cover'
          }}>
        </div>
      )}
    </CollapsibleSection>
  );
};

export default BackgroundImageSection;
