
import React, { useState, useEffect } from 'react';
import { useBookshelfStore } from '../store/bookshelfStore';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import BookCover from './book-modal/BookCover';
import BookModalTabs from './book-modal/BookModalTabs';
import BookModalFooter from './book-modal/BookModalFooter';

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
        
        <BookModalTabs 
          bookData={bookData}
          handleInputChange={handleInputChange}
          setRating={setRating}
          addEmptyQuiz={addEmptyQuiz}
          updateQuiz={updateQuiz}
          removeQuiz={removeQuiz}
        />
        
        <BookModalFooter 
          handleSave={handleSave}
          handleDelete={handleDelete}
          closeModal={closeModal}
        />
      </DialogContent>
    </Dialog>
  );
};

export default BookModal;
