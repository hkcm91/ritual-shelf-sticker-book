
import React from 'react';

const ModalBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-slate-950/5 via-slate-900/5 to-slate-800/3 z-0 overflow-hidden">
      <div className="absolute inset-0 opacity-2 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.05),rgba(255,255,255,0))]"></div>
    </div>
  );
};

export default ModalBackground;
