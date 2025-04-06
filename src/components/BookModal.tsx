
import React, { useState, useEffect } from 'react';
import { useBookshelfStore } from '../store/bookshelfStore';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star, Book as BookIcon, HelpCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
  
  // Placeholder functions for quiz functionality
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
        
        {book && (
          <div 
            className="w-full h-40 bg-muted rounded-md bg-cover bg-center" 
            style={{ backgroundImage: `url(${book.coverURL})` }}
          ></div>
        )}
        
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
          </TabsContent>
          
          <TabsContent value="notes" className="space-y-4 pt-4">
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
          </TabsContent>
          
          <TabsContent value="quizzes" className="space-y-4 pt-4">
            <div className="text-center mb-2">
              <p className="text-sm text-muted-foreground mb-2">Create quiz questions to test your knowledge about this book.</p>
              <Button 
                onClick={addEmptyQuiz} 
                variant="outline" 
                size="sm"
                className="mx-auto"
              >
                Add Quiz Question
              </Button>
            </div>
            
            {bookData.quizzes.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <HelpCircle className="h-10 w-10 mx-auto mb-2 opacity-50" />
                <p>No quiz questions yet</p>
                <p className="text-sm">Click the button above to add your first question</p>
              </div>
            ) : (
              <div className="space-y-5">
                {bookData.quizzes.map((quiz, index) => (
                  <div key={index} className="border rounded-md p-3 space-y-3 relative">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="absolute right-2 top-2 h-6 w-6 p-0" 
                      onClick={() => removeQuiz(index)}
                    >
                      ×
                    </Button>
                    <div className="grid gap-2">
                      <Label htmlFor={`question-${index}`}>Question</Label>
                      <Input
                        id={`question-${index}`}
                        value={quiz.question}
                        onChange={(e) => updateQuiz(index, 'question', e.target.value)}
                        placeholder="Enter your question here..."
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor={`answer-${index}`}>Answer</Label>
                      <Input
                        id={`answer-${index}`}
                        value={quiz.answer}
                        onChange={(e) => updateQuiz(index, 'answer', e.target.value)}
                        placeholder="Enter the answer here..."
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
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
