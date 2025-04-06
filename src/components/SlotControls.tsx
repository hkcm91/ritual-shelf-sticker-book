
import React from 'react';

type SlotControlsProps = {
  onShowBgImageDialog: () => void;
};

const SlotControls: React.FC<SlotControlsProps> = ({ onShowBgImageDialog }) => {
  return (
    <>
      {/* Background customization hint */}
      <div className="absolute top-2 right-2">
        <button 
          className="h-6 w-6 bg-black/30 hover:bg-black/50 text-white/70 opacity-40 hover:opacity-100 rounded"
          onClick={(e) => {
            e.stopPropagation();
            onShowBgImageDialog();
          }}
        >
          BG
        </button>
      </div>
    </>
  );
};

export default SlotControls;
