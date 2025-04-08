
import { useCallback } from 'react';
import { toast } from 'sonner';

export interface UseFileValidationProps {
  slotType?: "book" | "sticker";
  acceptedFileTypes?: string[];
  maxFileSize?: number;
}

export const useFileValidation = ({
  slotType = "book",
  acceptedFileTypes = [],
  maxFileSize = 5 * 1024 * 1024  // 5MB default
}: UseFileValidationProps) => {
  
  const validateFileType = useCallback((file: File): boolean => {
    if (acceptedFileTypes.length === 0) {
      // Default validations based on slot type
      if (slotType === "book") {
        return file.type.startsWith('image/');
      } else if (slotType === "sticker") {
        return file.type.startsWith('image/') || 
               file.type === 'application/json' || 
               file.name.endsWith('.json');
      }
      return true;
    }
    
    // Custom validation based on provided acceptedFileTypes
    return acceptedFileTypes.some(type => {
      if (type.includes('*')) {
        // Handle wildcards like 'image/*'
        const prefix = type.split('/')[0];
        return file.type.startsWith(`${prefix}/`);
      }
      return file.type === type || (type === '.json' && file.name.endsWith('.json'));
    });
  }, [acceptedFileTypes, slotType]);
  
  const validateFileSize = useCallback((file: File): boolean => {
    return file.size <= maxFileSize;
  }, [maxFileSize]);
  
  const getFileTypeSupportMessage = useCallback((): string => {
    if (acceptedFileTypes.length > 0) {
      return acceptedFileTypes.join(', ');
    }
    
    if (slotType === "book") {
      return 'image files';
    } else if (slotType === "sticker") {
      return 'image files or Lottie JSON files';
    }
    
    return 'files';
  }, [acceptedFileTypes, slotType]);
  
  const validateFile = useCallback((file: File): { valid: boolean; error?: string } => {
    // Validate file type
    if (!validateFileType(file)) {
      return {
        valid: false,
        error: `Unsupported file type. Please use ${getFileTypeSupportMessage()}`
      };
    }
    
    // Validate file size
    if (!validateFileSize(file)) {
      const maxSizeMB = maxFileSize / (1024 * 1024);
      return {
        valid: false,
        error: `File is too large. Maximum size is ${maxSizeMB}MB`
      };
    }
    
    return { valid: true };
  }, [validateFileType, validateFileSize, getFileTypeSupportMessage, maxFileSize]);

  return {
    validateFile,
    validateFileType,
    validateFileSize,
    getFileTypeSupportMessage
  };
};

export default useFileValidation;
