
import React from 'react';
import { Link } from 'react-router-dom';
import { NotebookPen } from 'lucide-react';

const WidgetLauncherButton: React.FC = () => {
  return (
    <Link to="/widgets">
      <button 
        className="game-btn text-sm flex items-center gap-1.5 h-9 px-4 from-amber-900/40 to-amber-950/40 text-amber-100 border-amber-600/20 group"
      >
        <NotebookPen className="h-4 w-4 group-hover:text-amber-300 transition-colors" />
        <span>Sticker Book</span>
      </button>
    </Link>
  );
};

export default WidgetLauncherButton;
