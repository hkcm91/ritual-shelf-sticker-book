
import React from 'react';
import { Lightbulb } from 'lucide-react';

const InfoSection: React.FC = () => {
  return (
    <div className="mt-5 p-3 bg-amber-900/20 rounded-lg border border-amber-800/20 flex items-start gap-3">
      <Lightbulb className="h-5 w-5 text-amber-300 flex-shrink-0 mt-0.5" />
      <div className="text-xs text-amber-200/80 space-y-2">
        <p>
          Adjust rows and columns to customize the size of your bookshelf. Books in removed rows or columns will be hidden but not deleted.
        </p>
        <p>
          <strong>Tip:</strong> For mobile-friendly bookshelves, use fewer columns (4-6) and more rows.
        </p>
      </div>
    </div>
  );
};

export default InfoSection;
