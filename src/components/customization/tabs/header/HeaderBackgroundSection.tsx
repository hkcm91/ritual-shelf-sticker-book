
import React, { useState } from 'react';
import { Paintbrush } from "lucide-react";
import { Button } from "@/components/ui/button";
import ColorPicker from "../../ColorPicker";
import ColorChart from "../../ColorChart";
import CollapsibleSection from "../../common/CollapsibleSection";
import { toast } from "sonner";

interface HeaderBackgroundSectionProps {
  background: string;
  onColorChange: (color: string) => void;
  isCollapsed: boolean;
  onToggle: () => void;
}

const HeaderBackgroundSection: React.FC<HeaderBackgroundSectionProps> = ({
  background,
  onColorChange,
  isCollapsed,
  onToggle
}) => {
  const [showColorChart, setShowColorChart] = useState(false);

  const handleColorSelect = (color: string) => {
    onColorChange(color);
    toast.success("Header background color updated");
  };

  // Color preview element for the section header
  const colorPreview = (
    <div 
      className="h-5 w-5 rounded-full border"
      style={{ backgroundColor: background }}
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
        color={background} 
        onChange={(color) => onColorChange(color)}
        allowAlpha={true}
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
            baseColor={background.startsWith('rgba') 
              ? background.replace(/rgba\((\d+),\s*(\d+),\s*(\d+).*/, 'rgb($1,$2,$3)')
              : background}
            onSelectColor={handleColorSelect}
          />
        </div>
      )}
    </CollapsibleSection>
  );
};

export default HeaderBackgroundSection;
