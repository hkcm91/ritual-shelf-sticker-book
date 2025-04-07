
import React from 'react';
import { Palette } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CollapsibleSection from "../../common/CollapsibleSection";

interface BackgroundSettingsProps {
  backgroundSize: string;
  backgroundRepeat: string;
  backgroundPosition: string;
  backgroundAttachment: string;
  onSettingChange: (property: string, value: string) => void;
  isCollapsed: boolean;
  onToggle: () => void;
}

const BackgroundSettingsSection: React.FC<BackgroundSettingsProps> = ({
  backgroundSize = 'cover',
  backgroundRepeat = 'no-repeat',
  backgroundPosition = 'center',
  backgroundAttachment = 'fixed',
  onSettingChange,
  isCollapsed,
  onToggle
}) => {
  return (
    <CollapsibleSection
      title="Background Settings"
      icon={Palette}
      isCollapsed={isCollapsed}
      onToggle={onToggle}
      borderBottom={false}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Background Size</Label>
          <Select 
            value={backgroundSize} 
            onValueChange={(value) => onSettingChange('backgroundSize', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cover">Cover (fill screen)</SelectItem>
              <SelectItem value="contain">Contain (show full image)</SelectItem>
              <SelectItem value="auto">Auto (original size)</SelectItem>
              <SelectItem value="100% 100%">Stretch</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Background Repeat</Label>
          <Select 
            value={backgroundRepeat} 
            onValueChange={(value) => onSettingChange('backgroundRepeat', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select repeat pattern" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="no-repeat">No Repeat</SelectItem>
              <SelectItem value="repeat">Repeat</SelectItem>
              <SelectItem value="repeat-x">Repeat Horizontally</SelectItem>
              <SelectItem value="repeat-y">Repeat Vertically</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Background Position</Label>
          <Select 
            value={backgroundPosition} 
            onValueChange={(value) => onSettingChange('backgroundPosition', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select position" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="center">Center</SelectItem>
              <SelectItem value="top">Top</SelectItem>
              <SelectItem value="bottom">Bottom</SelectItem>
              <SelectItem value="left">Left</SelectItem>
              <SelectItem value="right">Right</SelectItem>
              <SelectItem value="top left">Top Left</SelectItem>
              <SelectItem value="top right">Top Right</SelectItem>
              <SelectItem value="bottom left">Bottom Left</SelectItem>
              <SelectItem value="bottom right">Bottom Right</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="fixed-bg"
            checked={backgroundAttachment === 'fixed'}
            onCheckedChange={(checked) => 
              onSettingChange('backgroundAttachment', checked ? 'fixed' : 'scroll')
            }
          />
          <Label htmlFor="fixed-bg">Fixed Background (doesn't scroll)</Label>
        </div>
      </div>
    </CollapsibleSection>
  );
};

export default BackgroundSettingsSection;
