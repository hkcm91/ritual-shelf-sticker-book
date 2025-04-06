
import React from 'react';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';

type BookModalFooterProps = {
  handleSave: () => void;
  handleDelete: () => void;
  closeModal: () => void;
};

const BookModalFooter: React.FC<BookModalFooterProps> = ({
  handleSave,
  handleDelete,
  closeModal
}) => {
  return (
    <DialogFooter className="sm:justify-between">
      <Button
        variant="destructive"
        onClick={handleDelete}
        type="button"
      >
        Delete
      </Button>
      
      <div>
        <Button
          variant="outline"
          onClick={closeModal}
          className="mr-2"
        >
          Cancel
        </Button>
        
        <Button
          onClick={handleSave}
          type="button"
        >
          Save
        </Button>
      </div>
    </DialogFooter>
  );
};

export default BookModalFooter;
