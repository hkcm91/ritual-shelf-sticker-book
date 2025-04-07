
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Paintbrush } from "lucide-react";
import ColorPicker from "../../ColorPicker";
import ColorChart from "../../ColorChart";
import CollapsibleSection from "../../common/CollapsibleSection";
import { toast } from "sonner";

interface BackgroundColorSectionProps {
  background: string;
  onColorChange: (color: string) => void;
  isCollapsed: boolean;
  onToggle: () => void;
}

const BackgroundColorSection: React.FC<BackgroundColorSectionProps> = ({
  background,
  onColorChange,
  isCollapsed,
  onToggle
}) => {
  const [showColorChart, setShowColorChart] = useState(false);

  const handleColorSelect = (color: string) => {
    onColorChange(color);
    toast.success("Background color updated");
  };

  // Color preview element for the right side of the section header
  const colorPreview = (
    <div 
      className="h-5 w-5 rounded-full border"
      style={{ backgroundColor: background || '#f5f5f5' }}
    />
  );

  return (
    <CollapsibleSection
      title="Background Color"
      icon={Paintbrush}
      isCollapsed={isCollapsed}
      onToggle={onToggle}
      rightElement={colorPreview}
    >
      <ColorPicker 
        color={background || '#f5f5f5'} 
        onChange={onColorChange}
      />
      
      <div className="flex justify-between items-center">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setShowColorChart(!showColorChart)}
          className="h-7 text-xs"
        >
          {showColorChart ? "Hide Color Chart" : "Show Color Chart"}
        </Button>
      </div>
      
      {showColorChart && (
        <div className="rounded-lg border p-3 mt-2 bg-background">
          <ColorChart
            color={background || '#f5f5f5'}
            onChange={handleColorSelect}
          />
        </div>
      )}
    </CollapsibleSection>
  );
};

export default BackgroundColorSection;
