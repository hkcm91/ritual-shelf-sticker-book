
import React from 'react';
import { BookIcon, HelpCircle, Star } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BookDetailsTab from './BookDetailsTab';
import BookNotesTab from './BookNotesTab';
import BookQuizTab from './BookQuizTab';

type BookModalTabsProps = {
  bookData: {
    title: string;
    author: string;
    series: string;
    progress: number;
    rating: number;
    characters: string[];
    plot: string;
    notes: string;
    quizzes: { question: string; answer: string }[];
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  setRating: (rating: number) => void;
  addEmptyQuiz: () => void;
  updateQuiz: (index: number, field: 'question' | 'answer', value: string) => void;
  removeQuiz: (index: number) => void;
};

const BookModalTabs: React.FC<BookModalTabsProps> = ({
  bookData,
  handleInputChange,
  setRating,
  addEmptyQuiz,
  updateQuiz,
  removeQuiz
}) => {
  return (
    <Tabs defaultValue="details" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="details" className="flex items-center gap-1">
          <BookIcon className="h-4 w-4" />
          <span>Details</span>
        </TabsTrigger>
        <TabsTrigger value="notes" className="flex items-center gap-1">
          <Star className="h-4 w-4" />
          <span>Notes</span>
        </TabsTrigger>
        <TabsTrigger value="quizzes" className="flex items-center gap-1">
          <HelpCircle className="h-4 w-4" />
          <span>Quizzes</span>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="details" className="space-y-4 pt-4">
        <BookDetailsTab 
          bookData={bookData} 
          handleInputChange={handleInputChange} 
          setRating={setRating} 
        />
      </TabsContent>
      
      <TabsContent value="notes" className="space-y-4 pt-4">
        <BookNotesTab 
          bookData={bookData} 
          handleInputChange={handleInputChange} 
        />
      </TabsContent>
      
      <TabsContent value="quizzes" className="space-y-4 pt-4">
        <BookQuizTab 
          quizzes={bookData.quizzes} 
          addEmptyQuiz={addEmptyQuiz} 
          updateQuiz={updateQuiz} 
          removeQuiz={removeQuiz} 
        />
      </TabsContent>
    </Tabs>
  );
};

export default BookModalTabs;
