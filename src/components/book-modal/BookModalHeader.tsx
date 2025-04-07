
import React from 'react';
import { DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

type BookModalHeaderProps = {
  title: string;
};

const BookModalHeader: React.FC<BookModalHeaderProps> = ({ title }) => {
  return (
    <DialogHeader>
      <DialogTitle>
        {title}
      </DialogTitle>
      <DialogDescription>
        Fill in the details about your book below.
      </DialogDescription>
    </DialogHeader>
  );
};

export default BookModalHeader;
