
import { useState, useEffect } from 'react';
import { useBookshelfStore } from '../store/bookshelfStore';
import { toast } from 'sonner';

export type BookModalData = {
  title: string;
  author: string;
  series: string;
  progress: number;
  rating: number;
  characters: string[];
  plot: string;
  notes: string;
  coverURL: string;
  quizzes: {question: string, answer: string}[];
};

export const useBookModal = () => {
  const { isModalOpen, activeBookId, books, closeModal, updateBook, deleteBook } = useBookshelfStore();
  
  const [bookData, setBookData] = useState<BookModalData>({
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
      
      console.log('Loaded book data from store:', {
        id: activeBookId,
        hasCover: !!coverURL,
        coverLength: coverURL ? coverURL.length : 0,
        coverSample: coverURL ? coverURL.substring(0, 50) + '...' : 'undefined'
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
    console.log('Cover changed, new length:', imageUrl ? imageUrl.length : 0);
    console.log('Cover sample:', imageUrl ? imageUrl.substring(0, 50) + '...' : 'undefined');
    
    setBookData(prev => ({
      ...prev,
      coverURL: imageUrl
    }));
  };
  
  const handleSave = () => {
    if (activeBookId) {
      // Make sure we are actually sending the cover URL data
      console.log('Saving book with cover:', bookData.coverURL ? `present (${bookData.coverURL.length} chars)` : 'missing');
      console.log('Cover sample being saved:', bookData.coverURL ? bookData.coverURL.substring(0, 50) + '...' : 'undefined');
      
      // Create update object explicitly to ensure coverURL is included
      const updateData = {
        title: bookData.title,
        author: bookData.author,
        series: bookData.series,
        progress: bookData.progress,
        rating: bookData.rating,
        characters: bookData.characters,
        plot: bookData.plot,
        notes: bookData.notes,
        coverURL: bookData.coverURL,
        quizzes: bookData.quizzes,
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
