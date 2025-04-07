
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Globe, FileUp } from 'lucide-react';

type UrlDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageUrl: string;
  onImageUrlChange: (url: string) => void;
  onSubmit: () => void;
};

const UrlDialog: React.FC<UrlDialogProps> = ({
  open,
  onOpenChange,
  imageUrl,
  onImageUrlChange,
  onSubmit
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSubmit();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
            />
            <div className="text-xs text-muted-foreground">
              Supported formats: JPG, PNG, GIF, SVG, and Lottie JSON files
            </div>
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSubmit} disabled={!imageUrl}>
            <Globe className="h-4 w-4 mr-2" />
            Add from URL
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UrlDialog;
