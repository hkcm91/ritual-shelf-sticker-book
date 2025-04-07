
import React, { useState } from 'react';
import { useBookshelfStore } from "@/store/bookshelfStore";
import { toast } from "sonner";
import BackgroundColorSection from './general/BackgroundColorSection';
import BackgroundImageSection from './general/BackgroundImageSection';
import BackgroundSettingsSection from './general/BackgroundSettingsSection';

const GeneralTab: React.FC = () => {
  const { 
    page, 
    updatePageBackground,
    updatePageBackgroundImage,
    updatePageSetting
  } = useBookshelfStore();

  const [isUploading, setIsUploading] = useState(false);
  const [collapseSection, setCollapseSection] = useState<Record<string, boolean>>({
    backgroundColor: false,
    backgroundImage: false,
    backgroundSettings: true
  });

  const toggleSection = (section: string) => {
    setCollapseSection(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleImageUpload = (url: string) => {
    updatePageBackgroundImage(url);
    toast.success("Background image updated");
  };

  return (
    <div className="space-y-6 max-h-[80vh] overflow-y-auto pr-1">
      <div className="rounded-md border p-4 space-y-4">
        <h3 className="text-lg font-medium">Page Background</h3>
        <p className="text-sm text-muted-foreground">
          Customize the background of the entire page.
        </p>
        
        {/* Background Color Section */}
        <BackgroundColorSection
          background={page?.background || '#f5f5f5'}
          onColorChange={updatePageBackground}
          isCollapsed={collapseSection.backgroundColor}
          onToggle={() => toggleSection('backgroundColor')}
        />
        
        {/* Background Image Section */}
        <BackgroundImageSection
          backgroundImage={page?.backgroundImage || ''}
          onImageChange={handleImageUpload}
          isCollapsed={collapseSection.backgroundImage}
          onToggle={() => toggleSection('backgroundImage')}
          isUploading={isUploading}
          setIsUploading={setIsUploading}
        />
        
        {/* Background Settings Section (only visible when image is present) */}
        {page?.backgroundImage && (
          <BackgroundSettingsSection
            backgroundSize={page?.backgroundSize || 'cover'}
            backgroundRepeat={page?.backgroundRepeat || 'no-repeat'}
            backgroundPosition={page?.backgroundPosition || 'center'}
            backgroundAttachment={page?.backgroundAttachment || 'fixed'}
            onSettingChange={updatePageSetting}
            isCollapsed={collapseSection.backgroundSettings}
            onToggle={() => toggleSection('backgroundSettings')}
          />
        )}
      </div>
    </div>
  );
};

export default GeneralTab;
