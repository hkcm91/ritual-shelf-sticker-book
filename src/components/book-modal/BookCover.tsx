
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { useImageProcessing } from '@/hooks/useImageProcessing';

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
  const { processImageFile } = useImageProcessing();
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && onCoverChange) {
      const file = e.target.files[0];
      try {
        // Process the image with resizing and compression if needed
        const processedImageUrl = await processImageFile(file, { forceResize: true });
        console.log("Book cover processed, length:", processedImageUrl.length);
        onCoverChange(processedImageUrl);
      } catch (error) {
        console.error("Error processing book cover:", error);
      } finally {
        // Clear the input to allow selecting the same file again
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    }
  };
  
  const handleUploadClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Use setTimeout to avoid issues with event propagation
    setTimeout(() => {
      fileInputRef.current?.click();
    }, 0);
  };
  
  return (
    <div className="relative">
      <div 
        className={`w-full h-40 bg-muted rounded-md bg-cover bg-center ${className} flex items-center justify-center`} 
        style={{ backgroundImage: coverURL ? `url(${coverURL})` : 'none' }}
      >
        {!coverURL && (
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
