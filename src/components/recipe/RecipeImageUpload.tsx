
import React, { useRef, useState } from 'react';
import { Upload, Image, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RecipeImageUploadProps {
  value: string | null;
  onChange: (value: string | null) => void;
}

const RecipeImageUpload: React.FC<RecipeImageUploadProps> = ({ value, onChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      onChange(result);
    };
    reader.readAsDataURL(file);
  };
  
  const handleRemoveImage = () => {
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  return (
    <div className="space-y-2">
      <label className="text-amber-700 text-sm font-medium block">Recipe Photo</label>
      
      <div 
        className={`
          relative aspect-video border-2 rounded-md overflow-hidden
          ${value ? 'border-amber-200' : 'border-dashed border-amber-300 bg-amber-50/50 hover:bg-amber-50'}
          transition-colors cursor-pointer
        `}
        onClick={() => !value && fileInputRef.current?.click()}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {value ? (
          <>
            <img 
              src={value} 
              alt="Recipe preview" 
              className="w-full h-full object-cover"
            />
            
            <div className={`
              absolute inset-0 bg-black/40 flex flex-col gap-2 items-center justify-center
              transition-opacity duration-200
              ${isHovering ? 'opacity-100' : 'opacity-0'}
            `}>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="bg-white/90 text-amber-800 border-amber-200 hover:bg-white"
              >
                <Upload className="h-4 w-4 mr-1" />
                Change
              </Button>
              
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveImage();
                }}
                className="bg-white/90 text-red-600 border-red-200 hover:bg-white"
              >
                <X className="h-4 w-4 mr-1" />
                Remove
              </Button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center">
            <Image className="h-8 w-8 text-amber-400 mb-2" />
            <p className="text-sm text-amber-700">Click to add a photo</p>
            <p className="text-xs text-amber-500/70 mt-1">or drag and drop an image here</p>
          </div>
        )}
      </div>
      
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleImageChange}
      />
      
      <p className="text-xs text-amber-600/80">
        Upload a delicious photo of your finished recipe.
      </p>
    </div>
  );
};

export default RecipeImageUpload;
