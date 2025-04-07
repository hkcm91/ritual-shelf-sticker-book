
import React, { useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileImage, XCircle } from "lucide-react";
import { toast } from "sonner";

interface FileInputFieldProps {
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
  clearLabel?: string;
  uploadLabel?: string;
}

const FileInputField: React.FC<FileInputFieldProps> = ({
  value,
  onChange,
  placeholder = "Enter image URL",
  clearLabel = "Clear",
  uploadLabel = "Upload Image"
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          try {
            onChange(event.target.result as string);
          } catch (error) {
            console.error('Error loading image:', error);
            toast.error('Image may be too large. Try using a URL instead.');
          }
        }
      };
      reader.readAsDataURL(file);
    } else {
      toast.error('Only image files are supported');
    }
    
    // Reset the input
    e.target.value = '';
  };

  return (
    <div className="flex flex-col gap-2">
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          className="flex-1"
        >
          <FileImage className="mr-1 h-4 w-4" /> {uploadLabel}
        </Button>
        
        <Button
          type="button"
          variant="outline"
          onClick={() => onChange('')}
          disabled={!value}
        >
          <XCircle className="mr-1 h-4 w-4" /> {clearLabel}
        </Button>
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
};

export default FileInputField;
