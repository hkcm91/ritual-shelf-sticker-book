
import React, { useRef } from 'react';
import { toast } from 'sonner';
import BgImageDialog from '../BgImageDialog';

type BackgroundSettingsProps = {
  showBgImageDialog: boolean;
  setShowBgImageDialog: (show: boolean) => void;
  bgImage: string | null;
  setBgImage: (image: string | null) => void;
  bgImageUrl: string;
  setBgImageUrl: (url: string) => void;
};

const BackgroundSettings: React.FC<BackgroundSettingsProps> = ({
  showBgImageDialog,
  setShowBgImageDialog,
  bgImage,
  setBgImage,
  bgImageUrl,
  setBgImageUrl
}) => {
  const bgFileInputRef = useRef<HTMLInputElement>(null);
  
  const handleBgFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.type.startsWith('image/')) {
      // Check file size before processing
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        toast.warning('Image is large and may not be stored locally', {
          description: 'Consider using an image URL instead.'
        });
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        if (typeof event.target?.result === 'string') {
          try {
            setBgImage(event.target.result);
            toast.success('Background image added successfully');
            setShowBgImageDialog(false);
          } catch (error) {
            toast.error('Failed to set background image', {
              description: 'The image might be too large. Try using a URL instead.'
            });
          }
        }
      };
      reader.readAsDataURL(file);
    } else {
      toast.error('Only image files are supported for backgrounds');
    }
    
    if (bgFileInputRef.current) {
      bgFileInputRef.current.value = '';
    }
  };
  
  const handleBgImageUrlSubmit = () => {
    if (!bgImageUrl) return;
    
    // When using URL, we just store the URL reference instead of the data
    setBgImage(bgImageUrl);
    toast.success('Background image added from URL');
    setShowBgImageDialog(false);
    setBgImageUrl('');
  };

  return (
    <>
      <BgImageDialog
        open={showBgImageDialog}
        onOpenChange={setShowBgImageDialog}
        bgImage={bgImage}
        bgImageUrl={bgImageUrl}
        onBgImageUrlChange={setBgImageUrl}
        onUploadClick={() => bgFileInputRef.current?.click()}
        onBgImageUrlSubmit={handleBgImageUrlSubmit}
        onBgImageRemove={() => setBgImage(null)}
      />
      
      <input
        ref={bgFileInputRef}
        type="file"
        accept="image/*"
        onChange={handleBgFileChange}
        className="hidden"
      />
    </>
  );
};

export default BackgroundSettings;
