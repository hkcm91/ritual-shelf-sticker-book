
import React from 'react';

type EmptySlotProps = {
  fileInputRef: React.RefObject<HTMLInputElement>;
};

const EmptySlot: React.FC<EmptySlotProps> = ({ fileInputRef }) => {
  return (
    <>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-5xl text-gray-300/20">+</span>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
      />
    </>
  );
};

export default EmptySlot;
