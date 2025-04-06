
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';

type BgImageDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bgImage: string | null;
  bgImageUrl: string;
  onBgImageUrlChange: (url: string) => void;
  onUploadClick: () => void;
  onBgImageUrlSubmit: () => void;
  onBgImageRemove: () => void;
};

const BgImageDialog: React.FC<BgImageDialogProps> = ({
  open,
  onOpenChange,
  bgImage,
  bgImageUrl,
  onBgImageUrlChange,
  onUploadClick,
  onBgImageUrlSubmit,
  onBgImageRemove
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Set Background Image</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Upload Image</h4>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                onClick={onUploadClick}
                className="w-full flex items-center justify-center gap-2"
              >
                <Upload className="h-4 w-4" />
                <span>Choose File</span>
              </Button>
            </div>
          </div>
          
          <div className="my-2">
            <div className="relative flex items-center">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="mx-3 text-xs text-gray-500">OR</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-2">Image URL</h4>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Enter image URL"
              value={bgImageUrl}
              onChange={(e) => onBgImageUrlChange(e.target.value)}
            />
          </div>
          
          {bgImage && (
            <div>
              <h4 className="text-sm font-medium mb-2">Current Background</h4>
              <div className="flex justify-between items-center">
                <div className="h-16 w-16 border rounded overflow-hidden">
                  <img src={bgImage} alt="Current background" className="h-full w-full object-cover" />
                </div>
                <Button variant="destructive" size="sm" onClick={onBgImageRemove}>
                  Remove
                </Button>
              </div>
            </div>
          )}
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={onBgImageUrlSubmit}
            disabled={!bgImageUrl}
          >
            Set URL Image
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BgImageDialog;
