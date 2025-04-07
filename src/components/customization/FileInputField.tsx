
import React, { useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileImage, XCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

interface FileInputFieldProps {
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
  clearLabel?: string;
  uploadLabel?: string;
  accept?: string;
  maxSizeMB?: number;
}

const FileInputField: React.FC<FileInputFieldProps> = ({
  value,
  onChange,
  placeholder = "Enter image URL",
  clearLabel = "Clear",
  uploadLabel = "Upload Image",
  accept = "image/*",
  maxSizeMB = 3
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const simulateProgress = () => {
    setIsUploading(true);
    setUploadProgress(0);
    
    // Simulate progress updates
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90; // Hold at 90% until complete
        }
        return prev + Math.floor(Math.random() * 15);
      });
    }, 100);
    
    return interval;
  };
  
  const completeProgress = (interval: number) => {
    clearInterval(interval);
    setUploadProgress(100);
    // Add a small delay before removing the progress indicator
    setTimeout(() => {
      setIsUploading(false);
      setUploadProgress(0);
    }, 500);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file size
    const maxSize = maxSizeMB * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error(`File is too large. Maximum size is ${maxSizeMB}MB.`);
      return;
    }
    
    // Start progress simulation
    const progressInterval = simulateProgress();
    
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          try {
            onChange(event.target.result as string);
            completeProgress(progressInterval);
          } catch (error) {
            clearInterval(progressInterval);
            setIsUploading(false);
            console.error('Error loading image:', error);
            toast.error('Image may be too large. Try using a URL instead.');
          }
        }
      };
      
      reader.onerror = () => {
        clearInterval(progressInterval);
        setIsUploading(false);
        toast.error('Failed to read the file');
      };
      
      reader.readAsDataURL(file);
    } else {
      clearInterval(progressInterval);
      setIsUploading(false);
      toast.error(`Only ${accept.replace('*', '')} files are supported`);
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
        disabled={isUploading}
      />
      
      {isUploading && (
        <div className="w-full mb-1">
          <Progress value={uploadProgress} className="h-1" />
          <p className="text-xs text-muted-foreground mt-1 text-center">
            {uploadProgress < 100 ? 'Uploading...' : 'Processing...'}
          </p>
        </div>
      )}
      
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          className="flex-1"
          disabled={isUploading}
        >
          {isUploading ? (
            <Loader2 className="mr-1 h-4 w-4 animate-spin" />
          ) : (
            <FileImage className="mr-1 h-4 w-4" />
          )}
          {isUploading ? 'Uploading...' : uploadLabel}
        </Button>
        
        <Button
          type="button"
          variant="outline"
          onClick={() => onChange('')}
          disabled={!value || isUploading}
        >
          <XCircle className="mr-1 h-4 w-4" /> {clearLabel}
        </Button>
        
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={handleFileChange}
          disabled={isUploading}
        />
      </div>
    </div>
  );
};

export default FileInputField;
