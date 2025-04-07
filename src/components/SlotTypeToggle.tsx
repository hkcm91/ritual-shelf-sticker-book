
import React from 'react';

type SlotTypeToggleProps = {
  slotType: "book" | "sticker";
  handleTypeToggle: (value: string) => void;
  isVisible?: boolean; // Add visibility prop
};

const SlotTypeToggle: React.FC<SlotTypeToggleProps> = ({ 
  slotType, 
  handleTypeToggle,
  isVisible = true // Default to visible
}) => {
  // If not visible, don't render anything
  if (!isVisible) return null;
  
  return (
    <div className="slot-toggle-container">
      <button
        className={`book-toggle-dot ${slotType === 'book' ? 'active' : ''}`}
        onClick={() => handleTypeToggle('book')}
        aria-label="Switch to book mode"
      />
      <button
        className={`sticker-toggle-dot ${slotType === 'sticker' ? 'active' : ''}`}
        onClick={() => handleTypeToggle('sticker')}
        aria-label="Switch to sticker mode"
      />
    </div>
  );
};

export default SlotTypeToggle;
