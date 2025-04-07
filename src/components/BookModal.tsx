
import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import BookCover from './book-modal/BookCover';
import BookModalTabs from './book-modal/BookModalTabs';
import BookModalFooter from './book-modal/BookModalFooter';
import BookModalHeader from './book-modal/BookModalHeader';
import { useBookModal } from '../hooks/useBookModal';
import { BookModalProvider } from '../contexts/BookModalContext';

const BookModal: React.FC = () => {
  const {
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
  } = useBookModal();
  
  const contextValue = {
    bookData,
    handleInputChange,
    setRating,
    addEmptyQuiz,
    updateQuiz,
    removeQuiz,
    handleCoverChange,
    handleSave,
    handleDelete,
    closeModal
  };
  
  return (
    <Dialog open={isModalOpen} onOpenChange={(open) => !open && closeModal()}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <BookModalProvider value={contextValue}>
          <BookModalHeader 
            title={activeBookId && books[activeBookId]?.title ? 'Edit Book' : 'Add New Book'} 
          />
          
          <BookCover />
          
          <BookModalTabs />
          
          <BookModalFooter />
        </BookModalProvider>
      </DialogContent>
    </Dialog>
  );
};

export default BookModal;
