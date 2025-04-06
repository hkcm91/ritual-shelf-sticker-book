
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Star } from 'lucide-react';

type BookDetailsTabProps = {
  bookData: {
    title: string;
    author: string;
    series: string;
    progress: number;
    rating: number;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  setRating: (rating: number) => void;
};

const BookDetailsTab: React.FC<BookDetailsTabProps> = ({ 
  bookData, 
  handleInputChange, 
  setRating 
}) => {
  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="title" className="text-right">Title</Label>
        <Input
          id="title"
          name="title"
          value={bookData.title}
          onChange={handleInputChange}
          className="col-span-3"
        />
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="author" className="text-right">Author</Label>
        <Input
          id="author"
          name="author"
          value={bookData.author}
          onChange={handleInputChange}
          className="col-span-3"
        />
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="series" className="text-right">Series</Label>
        <Input
          id="series"
          name="series"
          value={bookData.series}
          onChange={handleInputChange}
          className="col-span-3"
        />
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="progress" className="text-right">Progress</Label>
        <Input
          id="progress"
          name="progress"
          type="number"
          min="0"
          max="100"
          value={bookData.progress}
          onChange={handleInputChange}
          className="col-span-3"
        />
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label className="text-right">Rating</Label>
        <div className="flex col-span-3">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`h-5 w-5 cursor-pointer ${
                star <= bookData.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
              }`}
              onClick={() => setRating(star)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookDetailsTab;
