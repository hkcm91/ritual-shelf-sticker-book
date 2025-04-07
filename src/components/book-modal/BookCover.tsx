
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { compressImage } from '@/utils/imageUtils';
import { toast } from 'sonner';

type BookCoverProps = {
  coverURL?: string;
  className?: string;
  onCoverChange?: (imageUrl: string) => void;
};

const BookCover: React.FC<BookCoverProps> = ({ 
  coverURL, 
  className = "",
  onCoverChange
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && onCoverChange) {
      const file = e.target.files[0];
      
      // Check file size - enforce stricter limit
      if (file.size > 3 * 1024 * 1024) { // 3MB max
        toast.error('Image is too large. Maximum size is 3MB.');
        return;
      }
      
      const reader = new FileReader();
      
      reader.onload = async (event) => {
        if (typeof event.target?.result === 'string') {
          try {
            console.log("Book cover loaded, length:", event.target.result.length);
            
            // Always compress the image at higher compression to ensure it can be stored
            let imageData = event.target.result;
            try {
              // First compression attempt - more aggressive
              imageData = await compressImage(imageData, {
                quality: 0.5, // Lower quality for better compression
                maxWidth: 500,
                maxHeight: 750
              });
              console.log("Book cover compressed (first pass), new length:", imageData.length);
              
              // If still too large, compress again more aggressively
              if (imageData.length > 500000) { // If over 500KB
                imageData = await compressImage(imageData, {
                  quality: 0.3, // Very aggressive compression
                  maxWidth: 400,
                  maxHeight: 600
                });
                console.log("Book cover compressed (second pass), new length:", imageData.length);
              }
            } catch (err) {
              console.warn('Failed to compress book cover:', err);
              toast.warning('Image could not be compressed. Storage issues may occur.');
              // Continue with original if compression fails
            }
            
            // Apply the change
            onCoverChange(imageData);
            toast.success('Cover image updated');
            
            // Verify that the cover was applied
            console.log("Cover URL after change:", imageData ? "Set (length: " + imageData.length + ")" : "Not set");
          } catch (error) {
            console.error('Error processing image:', error);
            toast.error('Failed to process image');
          }
        }
      };
      
      reader.onerror = () => {
        toast.error('Failed to read the image file');
      };
      
      reader.readAsDataURL(file);
    }
  };
  
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };
  
  // Check if coverURL is valid and not empty
  const hasCover = coverURL && coverURL.trim() !== '';
  
  return (
    <div className="relative">
      <div 
        className={`w-full h-40 bg-muted rounded-md bg-cover bg-center ${className} flex items-center justify-center`} 
        style={{ backgroundImage: hasCover ? `url(${coverURL})` : 'none' }}
      >
        {!hasCover && (
          <span className="text-gray-400 text-sm">No cover image</span>
        )}
      </div>
      
      <Button 
        type="button" 
        variant="outline" 
        size="sm"
        className="absolute bottom-2 right-2 bg-background/80 backdrop-blur-sm"
        onClick={handleUploadClick}
      >
        <Upload className="h-3 w-3 mr-1" />
        <span className="text-xs">Upload Cover</span>
      </Button>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default BookCover;
