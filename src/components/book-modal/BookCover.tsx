
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';

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
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && onCoverChange) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = (event) => {
        if (typeof event.target?.result === 'string') {
          onCoverChange(event.target.result);
        }
      };
      
      reader.readAsDataURL(file);
    }
  };
  
  const handleUploadClick = () => {
    fileInputRef.current?.click();
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
