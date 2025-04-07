
import React, { createContext, useContext } from 'react';
import { BookModalData } from '../hooks/useBookModal';

interface BookModalContextProps {
  bookData: BookModalData;
  handleInputChange: (field: string, value: any) => void;
  setRating: (value: number) => void;
  addEmptyQuiz: () => void;
  updateQuiz: (index: number, field: 'question' | 'answer', value: string) => void;
  removeQuiz: (index: number) => void;
  handleCoverChange: (coverURL: string) => void;
  handleSave: () => void;
  handleDelete: () => void;
  closeModal: () => void;
  isUploading?: boolean;
  uploadProgress?: number;
}

const BookModalContext = createContext<BookModalContextProps | undefined>(undefined);

export const BookModalProvider: React.FC<{ children: React.ReactNode; value: BookModalContextProps }> = ({
  children,
  value
}) => {
  return (
    <BookModalContext.Provider value={value}>
      {children}
    </BookModalContext.Provider>
  );
};

export const useBookModalContext = (): BookModalContextProps => {
  const context = useContext(BookModalContext);
  if (!context) {
    throw new Error('useBookModalContext must be used within a BookModalProvider');
  }
  return context;
};
