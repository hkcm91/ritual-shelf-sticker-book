
import React, { useRef, useState } from 'react';
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
  isLoading?: boolean;
  setIsLoading?: React.Dispatch<React.SetStateAction<boolean>>;
  accept?: string;
  helpText?: string;
}

const FileInputField: React.FC<FileInputFieldProps> = ({
  value,
  onChange,
  placeholder = "Enter image URL",
  clearLabel = "Clear",
  uploadLabel = "Upload Image",
  isLoading = false,
  setIsLoading,
  accept = "image/*",
  helpText
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.type.startsWith('image/')) {
      if (setIsLoading) setIsLoading(true);
      
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          try {
            onChange(event.target.result as string);
          } catch (error) {
            console.error('Error loading image:', error);
            toast.error('Image may be too large. Try using a URL instead.');
          } finally {
            if (setIsLoading) setIsLoading(false);
            // Clear the input to allow selecting the same file again
            if (fileInputRef.current) {
              fileInputRef.current.value = '';
            }
          }
        }
      };
      
      reader.onerror = () => {
        toast.error('Failed to read the file');
        if (setIsLoading) setIsLoading(false);
        // Clear the input to allow selecting the same file again
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      };
      
      reader.readAsDataURL(file);
    } else {
      toast.error('Only image files are supported');
      // Clear the input to allow selecting the same file again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleUploadClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Triggering file input click");
    
    // Use setTimeout to avoid issues with event propagation
    setTimeout(() => {
      fileInputRef.current?.click();
    }, 0);
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
          onClick={handleUploadClick}
          className="flex-1"
          disabled={isLoading}
        >
          <FileImage className="mr-1 h-4 w-4" /> 
          {isLoading ? "Uploading..." : uploadLabel}
        </Button>
        
        <Button
          type="button"
          variant="outline"
          onClick={() => onChange('')}
          disabled={!value || isLoading}
        >
          <XCircle className="mr-1 h-4 w-4" /> {clearLabel}
        </Button>
        
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={handleFileChange}
          disabled={isLoading}
        />
      </div>
      
      {helpText && (
        <p className="text-xs text-muted-foreground">{helpText}</p>
      )}
    </div>
  );
};

export default FileInputField;
