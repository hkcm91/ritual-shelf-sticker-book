
import React from 'react';
import { useBookshelfStore } from '@/store/bookshelfStore';
import { Card, CardContent } from "@/components/ui/card";
import HorizontalDividersControl from './layout/HorizontalDividersControl';
import VerticalDividersControl from './layout/VerticalDividersControl';
import RowControls from './layout/RowControls';
import ColumnControls from './layout/ColumnControls';
import { Rows3, Columns3, Divide } from 'lucide-react';

const LayoutTab: React.FC = () => {
  const { activeShelfId } = useBookshelfStore();

  return (
    <div className="space-y-6">
      <Card className="bg-amber-950/20 border border-amber-700/30">
        <CardContent className="pt-6 space-y-6">
          <h3 className="text-lg font-semibold text-amber-300 mb-2 flex items-center gap-2">
            <Rows3 className="h-4 w-4" />
            Shelf Layout
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <RowControls />
            <ColumnControls />
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-amber-950/20 border border-amber-700/30">
        <CardContent className="pt-6 space-y-6">
          <h3 className="text-lg font-semibold text-amber-300 mb-2 flex items-center gap-2">
            <Divide className="h-4 w-4" />
            Dividers
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <VerticalDividersControl />
            <HorizontalDividersControl />
          </div>
        </CardContent>
      </Card>
      
      <div className="text-sm text-amber-200/70 p-3 bg-amber-900/20 rounded-lg border border-amber-800/20">
        These settings control the layout of your bookshelf.
        Changes will apply to the current active library.
      </div>
    </div>
  );
};

export default LayoutTab;
