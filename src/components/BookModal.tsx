
import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import BookCover from './book-modal/BookCover';
import BookModalTabs from './book-modal/BookModalTabs';
import BookModalFooter from './book-modal/BookModalFooter';
import BookModalHeader from './book-modal/BookModalHeader';
import { useBookModal } from '../hooks/useBookModal';

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
  
  return (
    <Dialog open={isModalOpen} onOpenChange={(open) => !open && closeModal()}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <BookModalHeader 
          title={activeBookId && books[activeBookId]?.title ? 'Edit Book' : 'Add New Book'} 
        />
        
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
        />
      </DialogContent>
    </Dialog>
  );
};

export default BookModal;
