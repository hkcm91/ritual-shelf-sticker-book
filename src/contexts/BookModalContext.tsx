
import React, { createContext, useContext, ReactNode } from 'react';
import { BookModalData } from '../hooks/useBookModal';

interface BookModalContextType {
  bookData: BookModalData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  setRating: (rating: number) => void;
  addEmptyQuiz: () => void;
  updateQuiz: (index: number, field: 'question' | 'answer', value: string) => void;
  removeQuiz: (index: number) => void;
  handleCoverChange: (imageUrl: string) => void;
  handleSave: () => void;
  handleDelete: () => void;
  closeModal: () => void;
}

const BookModalContext = createContext<BookModalContextType | undefined>(undefined);

export const useBookModalContext = () => {
  const context = useContext(BookModalContext);
  if (!context) {
    throw new Error('useBookModalContext must be used within a BookModalProvider');
  }
  return context;
};

interface BookModalProviderProps {
  children: ReactNode;
  value: BookModalContextType;
}

export const BookModalProvider: React.FC<BookModalProviderProps> = ({ children, value }) => {
  return (
    <BookModalContext.Provider value={value}>
      {children}
    </BookModalContext.Provider>
  );
};
