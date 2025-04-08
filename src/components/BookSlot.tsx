
import React from 'react';
import BookSlot from './bookslot/BookSlot';

type BookSlotWrapperProps = {
  position: number;
};

const BookSlotWrapper: React.FC<BookSlotWrapperProps> = ({ position }) => {
  return <BookSlot position={position} />;
};

export default BookSlotWrapper;
