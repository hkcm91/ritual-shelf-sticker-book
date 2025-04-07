
import React from 'react';

const ModalBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-slate-950/20 via-slate-900/15 to-slate-800/10 z-0 overflow-hidden">
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.2),rgba(255,255,255,0))]"></div>
    </div>
  );
};

export default ModalBackground;
