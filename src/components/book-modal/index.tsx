
import React from 'react';
import { useBookshelfStore } from '../../store/bookshelfStore';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useBookModal } from '@/hooks/useBookModal';

// Import subcomponents
import BookCover from './BookCover';
import BookModalTabs from './BookModalTabs';
import BookModalFooter from './BookModalFooter';

const BookModal: React.FC = () => {
  const { isModalOpen, activeBookId, books, closeModal } = useBookshelfStore();
  const {
    bookData,
    isNewBook,
    handleInputChange,
    handleCoverChange,
    handleSave,
    handleDelete,
    setRating,
    addEmptyQuiz,
    updateQuiz,
    removeQuiz
  } = useBookModal();
  
  console.log("[BookModal] Rendering with isModalOpen:", isModalOpen, "activeBookId:", activeBookId);
  
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
          isNewBook={isNewBook}
        />
      </DialogContent>
    </Dialog>
  );
};

export default BookModal;
