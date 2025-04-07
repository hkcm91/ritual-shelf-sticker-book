
import { useState, useEffect } from 'react';
import { useBookshelfStore } from '../store/bookshelfStore';
import { toast } from 'sonner';
import { useBookInputs, BookInputs } from './book-modal/useBookInputs';
import { useBookQuizzes } from './book-modal/useBookQuizzes';
import { useBookCover } from './book-modal/useBookCover';

export type BookModalData = BookInputs & {
  coverURL: string;
  quizzes: {question: string, answer: string}[];
};

export const useBookModal = () => {
  const { isModalOpen, activeBookId, books, closeModal, updateBook, deleteBook } = useBookshelfStore();
  
  // Initialize the book data with default values
  const defaultBookData: BookModalData = {
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
  };
  
  // Set up the modular hooks with default values
  const { inputs, setInputs, handleInputChange, setRating } = useBookInputs({
    title: '',
    author: '',
    series: '',
    progress: 0,
    rating: 0,
    characters: [],
    plot: '',
    notes: ''
  });
  
  const { coverURL, setCoverURL, handleCoverChange } = useBookCover('');
  const { quizzes, setQuizzes, addEmptyQuiz, updateQuiz, removeQuiz } = useBookQuizzes([]);
  
  // Load book data from store when activeBookId changes
  useEffect(() => {
    if (activeBookId && books[activeBookId]) {
      const currentBook = books[activeBookId];
      
      // Update inputs
      setInputs({
        title: currentBook.title || '',
        author: currentBook.author || '',
        series: currentBook.series || '',
        progress: currentBook.progress || 0,
        rating: currentBook.rating || 0,
        characters: Array.isArray(currentBook.characters) ? currentBook.characters : [],
        plot: currentBook.plot || '',
        notes: currentBook.notes || ''
      });
      
      // Update cover
      setCoverURL(currentBook.coverURL || '');
      
      // Update quizzes
      setQuizzes(currentBook.quizzes || []);
      
      console.log('Loaded book data from store:', {
        id: activeBookId,
        hasCover: !!currentBook.coverURL,
        coverLength: currentBook.coverURL ? currentBook.coverURL.length : 0,
        coverSample: currentBook.coverURL ? currentBook.coverURL.substring(0, 50) + '...' : 'undefined'
      });
    } else {
      // Reset form for new books
      setInputs({
        title: '',
        author: '',
        series: '',
        progress: 0,
        rating: 0,
        characters: [],
        plot: '',
        notes: ''
      });
      setCoverURL('');
      setQuizzes([]);
    }
  }, [activeBookId, books, setInputs, setCoverURL, setQuizzes]);
  
  // Combine all data for consuming components
  const bookData: BookModalData = {
    ...inputs,
    coverURL,
    quizzes
  };
  
  const handleSave = () => {
    if (activeBookId) {
      // Make sure we are actually sending the cover URL data
      console.log('Saving book with cover:', bookData.coverURL ? `present (${bookData.coverURL.length} chars)` : 'missing');
      console.log('Cover sample being saved:', bookData.coverURL ? bookData.coverURL.substring(0, 50) + '...' : 'undefined');
      
      // Important: Create a complete update object with all required fields
      const updateData = {
        title: bookData.title,
        author: bookData.author,
        series: bookData.series,
        progress: bookData.progress,
        rating: bookData.rating,
        characters: bookData.characters,
        plot: bookData.plot,
        notes: bookData.notes,
        quizzes: bookData.quizzes,
        // Fix: Explicitly include coverURL to ensure it's saved
        coverURL: bookData.coverURL,
        // Important: preserve these flags that should not be changed
        hidden: books[activeBookId]?.hidden || false,
        isSticker: books[activeBookId]?.isSticker || false
      };
      
      updateBook(activeBookId, updateData);
      
      // Verify cover was included
      setTimeout(() => {
        const savedBook = books[activeBookId];
        if (savedBook) {
          console.log('After save - Book cover in store:', 
            savedBook.coverURL ? `present (${savedBook.coverURL.length} chars)` : 'missing');
          console.log('Cover sample after save:', savedBook.coverURL ? savedBook.coverURL.substring(0, 50) + '...' : 'undefined');
        }
      }, 100);
    }
    closeModal();
  };
  
  const handleDelete = () => {
    if (activeBookId) {
      deleteBook(activeBookId);
    }
    closeModal();
  };
  
  return {
    isModalOpen,
    activeBookId,
    books,
    bookData,
    closeModal,
    handleInputChange,
    handleCoverChange,
    handleSave,
    handleDelete,
    setRating,
    addEmptyQuiz,
    updateQuiz,
    removeQuiz
  };
};
