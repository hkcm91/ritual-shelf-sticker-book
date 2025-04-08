
import React from 'react';
import { Button } from '@/components/ui/button';
import { Save, Trash } from 'lucide-react';

interface BookModalFooterProps {
  handleSave: () => void;
  handleDelete: () => void;
  closeModal: () => void;
  isNewBook?: boolean;
}

const BookModalFooter: React.FC<BookModalFooterProps> = ({ 
  handleSave, 
  handleDelete, 
  closeModal,
  isNewBook = false
}) => {
  return (
    <div className="flex justify-between pt-4 mt-4 border-t">
      <div>
        {!isNewBook && (
          <Button 
            variant="destructive" 
            onClick={handleDelete} 
            type="button"
            size="sm"
            className="text-xs"
          >
            <Trash className="h-3.5 w-3.5 mr-1" />
            Delete
          </Button>
        )}
      </div>
      
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          onClick={closeModal} 
          type="button"
          size="sm"
        >
          Cancel
        </Button>
        
        <Button 
          onClick={handleSave} 
          type="button"
          size="sm"
          className="gap-1"
        >
          <Save className="h-3.5 w-3.5" />
          {isNewBook ? 'Create' : 'Save'}
        </Button>
      </div>
    </div>
  );
};

export default BookModalFooter;
