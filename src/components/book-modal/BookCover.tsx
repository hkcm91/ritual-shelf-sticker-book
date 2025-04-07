
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Loader2 } from 'lucide-react';
import { compressImage } from '@/utils/imageUtils';
import { toast } from 'sonner';
import { useBookModalContext } from '@/contexts/BookModalContext';
import { Progress } from '@/components/ui/progress';

type BookCoverProps = {
  className?: string;
};

const BookCover: React.FC<BookCoverProps> = ({ 
  className = ""
}) => {
  const { bookData, handleCoverChange } = useBookModalContext();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isCompressing, setIsCompressing] = React.useState(false);
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && handleCoverChange) {
      const file = e.target.files[0];
      
      // Check file size - enforce stricter limit
      if (file.size > 5 * 1024 * 1024) { // 5MB max
        toast.error('Image is too large. Maximum size is 5MB.');
        return;
      }
      
      try {
        setIsCompressing(true);
        
        const reader = new FileReader();
        reader.onload = async (event) => {
          if (typeof event.target?.result === 'string') {
            try {
              console.log("Book cover loaded, length:", event.target.result.length);
              
              // Always compress the image to ensure it can be stored
              let imageData = event.target.result;
              
              // First compression attempt - more aggressive
              imageData = await compressImage(imageData, {
                quality: 0.6, // Lower quality for better compression
                maxWidth: 500,
                maxHeight: 750
              });
              console.log("Book cover compressed (first pass), new length:", imageData.length);
              
              // If still too large, compress again more aggressively
              if (imageData.length > 500000) { // If over 500KB
                imageData = await compressImage(imageData, {
                  quality: 0.4, // Very aggressive compression
                  maxWidth: 400,
                  maxHeight: 600
                });
                console.log("Book cover compressed (second pass), new length:", imageData.length);
              }
              
              // Apply the change - make sure we're calling the context function
              handleCoverChange(imageData);
              toast.success('Cover image updated');
              
              // Verify that the cover was applied
              console.log("Cover URL after change:", imageData ? "Set (length: " + imageData.length + ")" : "Not set");
              console.log("BookData cover URL: ", bookData.coverURL ? "Set" : "Not set");
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
      } finally {
        setIsCompressing(false);
        
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    }
  };
  
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };
  
  // Check if coverURL is valid and not empty
  const hasCover = bookData.coverURL && bookData.coverURL.trim() !== '';
  
  return (
    <div className="relative">
      <div 
        className={`w-full h-40 bg-muted rounded-md bg-cover bg-center ${className} flex items-center justify-center`} 
        style={{ backgroundImage: hasCover ? `url(${bookData.coverURL})` : 'none' }}
      >
        {!hasCover && (
          <span className="text-gray-400 text-sm">No cover image</span>
        )}
        
        {isCompressing && (
          <div className="absolute inset-0 bg-black/50 rounded-md flex flex-col items-center justify-center">
            <Loader2 className="h-8 w-8 text-white animate-spin mb-2" />
            <span className="text-white text-sm">Compressing image...</span>
          </div>
        )}
      </div>
      
      <Button 
        type="button" 
        variant="outline" 
        size="sm"
        className="absolute bottom-2 right-2 bg-background/80 backdrop-blur-sm"
        onClick={handleUploadClick}
        disabled={isCompressing}
      >
        {isCompressing ? (
          <Loader2 className="h-3 w-3 mr-1 animate-spin" />
        ) : (
          <Upload className="h-3 w-3 mr-1" />
        )}
        <span className="text-xs">
          {isCompressing ? 'Processing...' : 'Upload Cover'}
        </span>
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
