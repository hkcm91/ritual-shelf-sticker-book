
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Globe, FileUp, Loader2 } from 'lucide-react';

type UrlDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageUrl: string;
  onImageUrlChange: (url: string) => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
};

const UrlDialog: React.FC<UrlDialogProps> = ({
  open,
  onOpenChange,
  imageUrl,
  onImageUrlChange,
  onSubmit,
  isSubmitting = false
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isSubmitting) {
      onSubmit();
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isSubmitting) {
        onOpenChange(isOpen);
      }
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Image from URL</DialogTitle>
          <DialogDescription>
            Enter a URL to an image or a Lottie JSON file
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2 py-4">
          <div className="grid flex-1 gap-2">
            <Input
              type="url"
              placeholder="https://example.com/image.jpg"
              value={imageUrl}
              onChange={(e) => onImageUrlChange(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full"
              disabled={isSubmitting}
            />
            <div className="text-xs text-muted-foreground">
              Supported formats: JPG, PNG, GIF, SVG, and Lottie JSON files
            </div>
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            onClick={onSubmit} 
            disabled={!imageUrl || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Globe className="h-4 w-4 mr-2" />
                Add from URL
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UrlDialog;
