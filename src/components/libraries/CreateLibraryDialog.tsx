
import React, { useState } from 'react';
import { Book, NotebookPen, Utensils, Music, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useBookshelfStore } from '@/store/bookshelfStore';
import { PopupWindow } from '@/components/ui/popup-window';

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
      available: true  // Changed from false to true to enable recipe libraries
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

  const footerContent = (
    <>
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
    </>
  );

  return (
    <PopupWindow
      isOpen={open}
      onClose={() => onOpenChange(false)}
      title={
        <>
          <Book className="h-5 w-5 text-amber-300" />
          <span>Create New Library</span>
        </>
      }
      footer={footerContent}
      size="md"
    >
      <div className="space-y-6">
        <div className="popup-section">
          <h3 className="popup-section-title">Basic Details</h3>
          <div className="space-y-4">
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
          </div>
        </div>

        <div className="popup-section">
          <h3 className="popup-section-title">Library Type</h3>
          <div className="grid grid-cols-2 gap-3 mt-2">
            {libraryTypes.map((type) => (
              <div 
                key={type.id}
                onClick={() => handleTypeSelection(type.id)}
                className={`
                  flex flex-col items-center gap-2 p-4 rounded-lg border transition-all cursor-pointer
                  ${type.available ? 'hover:bg-amber-800/30' : 'opacity-60 cursor-not-allowed'}
                  ${selectedType === type.id 
                    ? 'bg-amber-800/40 border-amber-500/40' 
                    : 'border-amber-700/20 bg-amber-950/10'
                  }
                `}
              >
                <div className={`text-${selectedType === type.id ? 'amber-300' : 'amber-100'} p-3 rounded-full
                  ${selectedType === type.id ? 'bg-amber-900/50' : 'bg-amber-950/30'} border border-amber-700/30`}>
                  {type.icon}
                </div>
                <span className="text-sm font-medium">{type.name}</span>
                {!type.available && (
                  <span className="text-xs text-amber-500/70">Coming Soon</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </PopupWindow>
  );
};
