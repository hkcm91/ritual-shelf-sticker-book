
import React from 'react';
import Header from '../components/layout/Header';
import { Book, NotebookPen, Utensils, Music, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useBookshelfStore } from '@/store/bookshelfStore';
import { toast } from 'sonner';

// Library type definitions
const libraryTypes = [
  {
    title: "Book Library",
    description: "Keep track of your books and reading progress",
    icon: <Book className="h-6 w-6" />,
    bgClass: "bg-amber-50",
    borderClass: "border-amber-200",
    available: true,
    type: "book"
  },
  {
    title: "Notebook Library",
    description: "Store and organize your notes and journals",
    icon: <NotebookPen className="h-6 w-6" />,
    bgClass: "bg-emerald-50",
    borderClass: "border-emerald-200",
    available: true,
    type: "notebook"
  },
  {
    title: "Recipe Library",
    description: "Collect recipes from online and family traditions",
    icon: <Utensils className="h-6 w-6" />,
    bgClass: "bg-rose-50",
    borderClass: "border-rose-200",
    available: false,
    type: "recipe"
  },
  {
    title: "Music Library",
    description: "Track your favorite songs and playlists",
    icon: <Music className="h-6 w-6" />,
    bgClass: "bg-purple-50",
    borderClass: "border-purple-200",
    available: false,
    type: "music"
  }
];

const WidgetLauncher: React.FC = () => {
  const navigate = useNavigate();
  const { addShelf } = useBookshelfStore();

  const handleCreateLibrary = (type: string, title: string) => {
    try {
      const shelfId = addShelf({
        name: `My ${title}`,
        rows: 2,
        columns: 4,
        type: type as any
      });
      
      if (shelfId) {
        toast.success(`${title} created successfully!`);
        navigate('/');
      }
    } catch (error) {
      console.error('Error creating library:', error);
      toast.error('Failed to create library');
    }
  };

  return (
    <div 
      className="min-h-screen flex flex-col"
      style={{
        backgroundColor: 'var(--page-bg, #f5f5f5)',
        backgroundImage: 'var(--page-bg-image, none)',
        backgroundSize: 'var(--page-bg-size, cover)',
        backgroundRepeat: 'var(--page-bg-repeat, no-repeat)',
        backgroundPosition: 'var(--page-bg-position, center)',
        backgroundAttachment: 'var(--page-bg-attachment, fixed)',
        color: 'var(--page-text-color, #333333)'
      }}
    >
      <Header />
      
      <div className="flex-grow w-full overflow-auto p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold mb-4">Widget Library Sticker Book</h1>
            <p className="text-lg mb-4 max-w-2xl mx-auto">
              Choose a library type to organize your collections. Each library type offers specialized features for its content.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            {libraryTypes.map((library, index) => (
              <div 
                key={index} 
                className={`relative overflow-hidden p-6 rounded-lg ${library.bgClass} border ${library.borderClass} shadow-md transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-2 rounded-md ${library.borderClass} bg-white/80`}>
                    {library.icon}
                  </div>
                  
                  {library.available && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 rounded-full"
                      onClick={() => handleCreateLibrary(library.type, library.title)}
                    >
                      <Plus className="h-4 w-4" />
                      <span className="sr-only">Create {library.title}</span>
                    </Button>
                  )}
                </div>
                
                <h2 className="text-xl font-semibold mb-2">{library.title}</h2>
                <p className="text-sm text-gray-700">{library.description}</p>
                
                {!library.available && (
                  <div className="absolute top-2 right-2 bg-gray-700 text-white text-xs px-2 py-1 rounded-full">
                    Coming Soon
                  </div>
                )}
                
                {library.available && (
                  <Button
                    className="w-full mt-4 bg-white/70 border border-gray-200 text-gray-800 hover:bg-white"
                    onClick={() => handleCreateLibrary(library.type, library.title)}
                  >
                    Create Library
                  </Button>
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-16 p-6 bg-amber-50/50 border border-amber-200/50 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">How to Use Your Libraries</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-amber-800 font-medium">
                  <span className="bg-amber-200 rounded-full w-6 h-6 flex items-center justify-center text-amber-800">1</span>
                  <span>Create a Library</span>
                </div>
                <p className="text-sm text-gray-600 pl-8">Choose a library type that fits your collection needs</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-amber-800 font-medium">
                  <span className="bg-amber-200 rounded-full w-6 h-6 flex items-center justify-center text-amber-800">2</span>
                  <span>Add Your Items</span>
                </div>
                <p className="text-sm text-gray-600 pl-8">Click any empty slot to add books, notes, or other items</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-amber-800 font-medium">
                  <span className="bg-amber-200 rounded-full w-6 h-6 flex items-center justify-center text-amber-800">3</span>
                  <span>Customize &amp; Organize</span>
                </div>
                <p className="text-sm text-gray-600 pl-8">Personalize your library with themes and stickers</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WidgetLauncher;
