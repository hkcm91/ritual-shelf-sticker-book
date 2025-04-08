
import React, { useState } from 'react';
import { Book, NotebookPen, Utensils, Music } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useBookshelfStore } from '@/store/bookshelfStore';

interface CreateLibraryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type LibraryType = 'book' | 'notebook' | 'recipe' | 'music';

interface LibraryTypeOption {
  id: LibraryType;
  name: string;
  icon: React.ReactNode;
  available: boolean;
}

export const CreateLibraryDialog: React.FC<CreateLibraryDialogProps> = ({ 
  open, 
  onOpenChange 
}) => {
  const [libraryName, setLibraryName] = useState('');
  const [selectedType, setSelectedType] = useState<LibraryType | null>(null);
  const { addShelf } = useBookshelfStore();

  const libraryTypes: LibraryTypeOption[] = [
    {
      id: 'book',
      name: 'Book Library',
      icon: <Book className="h-5 w-5" />,
      available: true
    },
    {
      id: 'notebook',
      name: 'Notebook Library',
      icon: <NotebookPen className="h-5 w-5" />,
      available: true
    },
    {
      id: 'recipe',
      name: 'Recipe Library',
      icon: <Utensils className="h-5 w-5" />,
      available: true
    },
    {
      id: 'music',
      name: 'Music Library',
      icon: <Music className="h-5 w-5" />,
      available: false
    }
  ];

  const handleCreateLibrary = () => {
    if (!libraryName.trim()) {
      toast.error('Please enter a library name');
      return;
    }

    if (!selectedType) {
      toast.error('Please select a library type');
      return;
    }

    try {
      // Create a new shelf with the given name
      const shelfId = addShelf({
        name: libraryName,
        rows: 2,
        columns: 4,
        type: selectedType
      });

      if (shelfId) {
        toast.success(`${libraryName} created successfully!`);
        // Reset form
        setLibraryName('');
        setSelectedType(null);
        // Close dialog
        onOpenChange(false);
      }
    } catch (error) {
      console.error('Error creating library:', error);
      toast.error('Failed to create library. Please try again.');
    }
  };

  const handleTypeSelection = (type: LibraryType) => {
    if (libraryTypes.find(t => t.id === type)?.available) {
      setSelectedType(type);
    } else {
      toast.info('This library type is coming soon!');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] collections-dropdown border-amber-500/20">
        <DialogHeader>
          <DialogTitle className="text-amber-300/90">Create New Library</DialogTitle>
          <DialogDescription className="text-amber-100/70">
            Create a new collection to organize your items.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="library-name" className="text-amber-200">Library Name</Label>
            <Input 
              id="library-name" 
              value={libraryName} 
              onChange={(e) => setLibraryName(e.target.value)} 
              placeholder="My Library"
              className="border-amber-700/30 bg-amber-950/20 text-amber-100"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-amber-200">Library Type</Label>
            <div className="grid grid-cols-2 gap-3 mt-1">
              {libraryTypes.map((type) => (
                <div 
                  key={type.id}
                  onClick={() => handleTypeSelection(type.id)}
                  className={`
                    flex flex-col items-center gap-2 p-3 rounded-md border transition-all cursor-pointer
                    ${type.available ? 'hover:bg-amber-800/30' : 'opacity-60 cursor-not-allowed'}
                    ${selectedType === type.id 
                      ? 'bg-amber-800/40 border-amber-500/40' 
                      : 'border-amber-700/20 bg-amber-950/10'
                    }
                  `}
                >
                  <div className={`text-${selectedType === type.id ? 'amber-300' : 'amber-100'}`}>
                    {type.icon}
                  </div>
                  <span className="text-sm">{type.name}</span>
                  {!type.available && (
                    <span className="text-xs text-amber-500/70">Coming Soon</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="border-amber-700/30 text-amber-200 hover:bg-amber-950/30"
          >
            Cancel
          </Button>
          <Button 
            type="button" 
            onClick={handleCreateLibrary}
            className="bg-gradient-to-b from-amber-700 to-amber-800 text-amber-100 hover:from-amber-600 hover:to-amber-700"
            disabled={!libraryName.trim() || !selectedType}
          >
            Create Library
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
