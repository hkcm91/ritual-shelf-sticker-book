
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

type BookNotesTabProps = {
  bookData: {
    plot: string;
    characters: string;
    notes: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
};

const BookNotesTab: React.FC<BookNotesTabProps> = ({ bookData, handleInputChange }) => {
  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-4 items-start gap-4">
        <Label htmlFor="plot" className="text-right">Plot</Label>
        <Textarea
          id="plot"
          name="plot"
          value={bookData.plot}
          onChange={handleInputChange}
          className="col-span-3"
          rows={3}
        />
      </div>
      
      <div className="grid grid-cols-4 items-start gap-4">
        <Label htmlFor="characters" className="text-right">Characters</Label>
        <Textarea
          id="characters"
          name="characters"
          value={bookData.characters}
          onChange={handleInputChange}
          className="col-span-3"
          rows={3}
        />
      </div>
      
      <div className="grid grid-cols-4 items-start gap-4">
        <Label htmlFor="notes" className="text-right">Notes</Label>
        <Textarea
          id="notes"
          name="notes"
          value={bookData.notes}
          onChange={handleInputChange}
          className="col-span-3"
          rows={4}
          placeholder="Your personal notes about this book..."
        />
      </div>
    </div>
  );
};

export default BookNotesTab;
