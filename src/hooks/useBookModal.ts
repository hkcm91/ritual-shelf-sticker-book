
import { useState, useEffect } from 'react';
import { useBookshelfStore } from '../store/bookshelfStore';

export interface BookFormData {
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
}

export const useBookModal = () => {
  const { activeBookId, books, closeModal, updateBook, deleteBook, addBook } = useBookshelfStore();
  
  const [bookData, setBookData] = useState<BookFormData>({
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
  
  // Load book data when activeBookId changes
  useEffect(() => {
    console.log("[useBookModal] Effect triggered with activeBookId:", activeBookId);
    
    if (activeBookId && books[activeBookId]) {
      console.log("[useBookModal] Loading existing book data");
      
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
      console.log("[useBookModal] Setting up new book form");
      
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
    console.log("[useBookModal] handleSave called, activeBookId:", activeBookId);
    
    if (activeBookId) {
      console.log("[useBookModal] Updating existing book");
      updateBook(activeBookId, bookData);
    } else {
      // For new books, add them to the store
      console.log("[useBookModal] Creating new book");
      const { activeShelfId, findEmptyPosition } = useBookshelfStore.getState();
      
      if (activeShelfId) {
        const position = findEmptyPosition(activeShelfId);
        console.log("[useBookModal] Found empty position:", position);
        
        if (position >= 0) {
          addBook({
            ...bookData,
            position,
            shelfId: activeShelfId,
            isSticker: false
          });
          console.log("[useBookModal] New book added at position:", position);
        } else {
          console.error("[useBookModal] No empty positions available!");
        }
      } else {
        console.error("[useBookModal] No active shelf!");
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
  
  return {
    bookData,
    isNewBook: !activeBookId,
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
