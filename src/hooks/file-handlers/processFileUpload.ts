
import { toast } from 'sonner';

type FileProcessorOptions = {
  handleBookFile?: (file: File) => Promise<string | undefined>;
  handleImageSticker?: (file: File) => Promise<string | undefined>;
  handleLottieSticker?: (file: File) => Promise<string | undefined>;
  slotType: "book" | "sticker";
};

export const processFileUpload = async (
  file: File,
  options: FileProcessorOptions
): Promise<string | undefined> => {
  const { slotType, handleBookFile, handleImageSticker, handleLottieSticker } = options;

  if (!file) return undefined;
  
  // For book type, only allow images
  if (slotType === "book") {
    if (!file.type.startsWith('image/')) {
      toast.error('Only image files are supported for books');
      return undefined;
    }
    
    if (handleBookFile) {
      return handleBookFile(file);
    }
  } 
  // For sticker type, allow images and Lottie JSON
  else if (slotType === "sticker") {
    if (file.type.startsWith('image/')) {
      if (handleImageSticker) {
        return handleImageSticker(file);
      }
    } else if (file.type === 'application/json' || file.name.endsWith('.json')) {
      if (handleLottieSticker) {
        return handleLottieSticker(file);
      }
    } else {
      toast.error('Unsupported file type. Please use images or Lottie JSON files.');
    }
  }
  
  return undefined;
};
