
import React, { useState, useEffect } from 'react';
import { useBookshelfStore } from '../store/bookshelfStore';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import BookCover from './book-modal/BookCover';
import BookModalTabs from './book-modal/BookModalTabs';
import BookModalFooter from './book-modal/BookModalFooter';

const BookModal: React.FC = () => {
  const { isModalOpen, activeBookId, books, closeModal, updateBook, deleteBook, addBook } = useBookshelfStore();
  
  const [bookData, setBookData] = useState({
    title: '',
    author: '',
    series: '',
    progress: 0,
    rating: 0,
    characters: [] as string[],
    plot: '',
    notes: '',
    coverURL: '',
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
        quizzes,
        coverURL
      } = books[activeBookId];
      
      setBookData({
        title: title || '',
        author: author || '',
        series: series || '',
        progress: progress || 0,
        rating: rating || 0,
        characters: Array.isArray(characters) ? characters : [],
        plot: plot || '',
        notes: notes || '',
        coverURL: coverURL || '',
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
        characters: [],
        plot: '',
        notes: '',
        coverURL: '',
        quizzes: []
      });
    }
  }, [activeBookId, books]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'characters') {
      // Split the text input by commas to create an array of characters
      const charactersArray = value.split(',').map(item => item.trim());
      setBookData(prev => ({ ...prev, characters: charactersArray }));
    } else {
      setBookData((prev) => ({
        ...prev,
        [name]: name === 'progress' ? Math.min(100, Math.max(0, parseInt(value) || 0)) : value,
      }));
    }
  };
  
  const handleCoverChange = (imageUrl: string) => {
    setBookData(prev => ({
      ...prev,
      coverURL: imageUrl
    }));
  };
  
  const handleSave = () => {
    if (activeBookId) {
      updateBook(activeBookId, bookData);
    } else {
      // For new books, add them to the store
      const { activeShelfId, findEmptyPosition } = useBookshelfStore.getState();
      if (activeShelfId) {
        const position = findEmptyPosition(activeShelfId);
        if (position >= 0) {
          addBook({
            ...bookData,
            position,
            shelfId: activeShelfId,
            isSticker: false
          });
        }
      }
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
          <DialogDescription>
            Fill in the details about your book below.
          </DialogDescription>
        </DialogHeader>
        
        <BookCover 
          coverURL={bookData.coverURL} 
          onCoverChange={handleCoverChange}
        />
        
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
          isNewBook={!activeBookId}
        />
      </DialogContent>
    </Dialog>
  );
};

export default BookModal;
