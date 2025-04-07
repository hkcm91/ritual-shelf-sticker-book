
import React, { useState } from 'react';
import { useBookshelfStore } from "@/store/bookshelfStore";
import { toast } from 'sonner';
import HeaderBackgroundSection from './header/HeaderBackgroundSection';
import HeaderImageSection from './header/HeaderImageSection';
import HeaderTextColorSection from './header/HeaderTextColorSection';
import HeaderPreviewSection from './header/HeaderPreviewSection';

const HeaderTab: React.FC = () => {
  const { header, updateHeaderSetting } = useBookshelfStore();
  const [showColorChart, setShowColorChart] = useState(false);
  const [collapseSection, setCollapseSection] = useState<Record<string, boolean>>({
    background: false,
    backgroundImage: false,
    textColor: false,
    preview: false
  });

  const toggleSection = (section: string) => {
    setCollapseSection(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="rounded-md border p-4 space-y-4 max-h-[80vh] overflow-y-auto">
      <h3 className="font-medium text-lg">Header Appearance</h3>
      
      {/* Background Color Section */}
      <HeaderBackgroundSection
        background={header.background}
        onColorChange={(color) => updateHeaderSetting('background', color)}
        isCollapsed={collapseSection.background}
        onToggle={() => toggleSection('background')}
      />
      
      {/* Background Image Section */}
      <HeaderImageSection
        backgroundImage={header.backgroundImage}
        onImageChange={(url) => updateHeaderSetting('backgroundImage', url)}
        isCollapsed={collapseSection.backgroundImage}
        onToggle={() => toggleSection('backgroundImage')}
      />
      
      {/* Text Color Section */}
      <HeaderTextColorSection
        textColor={header.textColor}
        onColorChange={(color) => updateHeaderSetting('textColor', color)}
        isCollapsed={collapseSection.textColor}
        onToggle={() => toggleSection('textColor')}
      />
      
      {/* Preview Section */}
      <HeaderPreviewSection
        background={header.background}
        backgroundImage={header.backgroundImage}
        textColor={header.textColor}
        isCollapsed={collapseSection.preview}
        onToggle={() => toggleSection('preview')}
      />
    </div>
  );
};

export default HeaderTab;
