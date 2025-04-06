
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

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
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Image from URL</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <input
            type="text"
            className="w-full px-3 py-2 border rounded-md"
            placeholder="Enter image or Lottie JSON URL"
            value={imageUrl}
            onChange={(e) => onImageUrlChange(e.target.value)}
          />
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSubmit}>
            Add
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UrlDialog;
