
import React from 'react';

const ModalBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-slate-950/10 via-slate-900/10 to-slate-800/5 z-0 overflow-hidden">
      <div className="absolute inset-0 opacity-3 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),rgba(255,255,255,0))]"></div>
    </div>
  );
};

export default ModalBackground;
