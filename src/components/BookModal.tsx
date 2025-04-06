
import React, { useState, useEffect } from 'react';
import { useBookshelfStore } from '../store/bookshelfStore';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Book as BookIcon, HelpCircle, Star } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Import the extracted components
import BookDetailsTab from './book-modal/BookDetailsTab';
import BookNotesTab from './book-modal/BookNotesTab';
import BookQuizTab from './book-modal/BookQuizTab';
import BookCover from './book-modal/BookCover';

const BookModal: React.FC = () => {
  const { isModalOpen, activeBookId, books, closeModal, updateBook, deleteBook } = useBookshelfStore();
  
  const [bookData, setBookData] = useState({
    title: '',
    author: '',
    series: '',
    progress: 0,
    rating: 0,
    characters: '',
    plot: '',
    notes: '',
    quizzes: [] as {question: string, answer: string}[]
  });
  
  useEffect(() => {
    if (activeBookId && books[activeBookId]) {
      const { 
        title, 
        author, 
        series, 
        progress, 
        rating, 
        characters, 
        plot, 
        notes, 
        quizzes 
      } = books[activeBookId];
      
      setBookData({
        title: title || '',
        author: author || '',
        series: series || '',
        progress: progress || 0,
        rating: rating || 0,
        characters: characters || '',
        plot: plot || '',
        notes: notes || '',
        quizzes: quizzes || []
      });
    } else {
      // Reset form for new books
      setBookData({
        title: '',
        author: '',
        series: '',
        progress: 0,
        rating: 0,
        characters: '',
        plot: '',
        notes: '',
        quizzes: []
      });
    }
  }, [activeBookId, books]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBookData((prev) => ({
      ...prev,
      [name]: name === 'progress' ? Math.min(100, Math.max(0, parseInt(value) || 0)) : value,
    }));
  };
  
  const handleSave = () => {
    if (activeBookId) {
      updateBook(activeBookId, bookData);
    }
    closeModal();
  };
  
  const handleDelete = () => {
    if (activeBookId) {
      deleteBook(activeBookId);
    }
    closeModal();
  };
  
  const setRating = (rating: number) => {
    setBookData((prev) => ({ ...prev, rating }));
  };
  
  const book = activeBookId ? books[activeBookId] : null;
  
  // Quiz handlers
  const addEmptyQuiz = () => {
    setBookData(prev => ({
      ...prev,
      quizzes: [...prev.quizzes, { question: '', answer: '' }]
    }));
  };
  
  const updateQuiz = (index: number, field: 'question' | 'answer', value: string) => {
    const updatedQuizzes = [...bookData.quizzes];
    updatedQuizzes[index] = { 
      ...updatedQuizzes[index], 
      [field]: value 
    };
    
    setBookData(prev => ({
      ...prev,
      quizzes: updatedQuizzes
    }));
  };
  
  const removeQuiz = (index: number) => {
    setBookData(prev => ({
      ...prev,
      quizzes: prev.quizzes.filter((_, i) => i !== index)
    }));
  };
  
  return (
    <Dialog open={isModalOpen} onOpenChange={(open) => !open && closeModal()}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {activeBookId && books[activeBookId]?.title ? 'Edit Book' : 'Add New Book'}
          </DialogTitle>
        </DialogHeader>
        
        <BookCover coverURL={book?.coverURL} />
        
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
      </DialogContent>
    </Dialog>
  );
};

export default BookModal;
