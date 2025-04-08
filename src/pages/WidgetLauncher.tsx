import React, { useEffect, useState } from 'react';
import Header from '../components/layout/Header';
import { Book, NotebookPen, Utensils, Music, Plus, Library, Settings, Edit3, ArrowRight, Trash2, BookMarked } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useBookshelfStore } from '@/store/bookshelfStore';
import { toast } from 'sonner';
import { CreateLibraryDialog } from '@/components/libraries/CreateLibraryDialog';
import { ShelfData } from '@/store/types';
import { PopupWindow } from '@/components/ui/popup-window';

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
  const { shelves, addShelf, updateShelf, deleteShelf } = useBookshelfStore();
  const [isCreateLibraryOpen, setIsCreateLibraryOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [libraryToEdit, setLibraryToEdit] = useState<ShelfData | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newLibraryName, setNewLibraryName] = useState('');

  // Group libraries by type
  const groupedLibraries = React.useMemo(() => {
    const result: Record<string, ShelfData[]> = {};
    
    Object.values(shelves).forEach(shelf => {
      const type = shelf.type || 'book';
      if (!result[type]) {
        result[type] = [];
      }
      result[type].push(shelf);
    });
    
    return result;
  }, [shelves]);
  
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
        navigate(`/library/${shelfId}`);
      }
    } catch (error) {
      console.error('Error creating library:', error);
      toast.error('Failed to create library');
    }
  };
  
  const handleOpenCreateDialog = (type: string) => {
    setSelectedType(type);
    setIsCreateLibraryOpen(true);
  };
  
  const handleEditLibrary = () => {
    if (libraryToEdit && newLibraryName.trim()) {
      updateShelf(libraryToEdit.id, { name: newLibraryName });
      setIsEditDialogOpen(false);
      setLibraryToEdit(null);
      toast.success('Library updated successfully');
    } else {
      toast.error('Library name cannot be empty');
    }
  };
  
  const handleDeleteLibrary = () => {
    if (libraryToEdit) {
      deleteShelf(libraryToEdit.id);
      setIsEditDialogOpen(false);
      setLibraryToEdit(null);
      toast.success('Library deleted successfully');
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
            <h1 className="text-3xl font-bold mb-4 flex items-center justify-center gap-3">
              <BookMarked className="h-8 w-8 text-purple-500" />
              <span>Library Collection</span>
            </h1>
            <p className="text-lg mb-6 max-w-2xl mx-auto">
              Choose a library type to organize your collections. Each library type offers specialized features for its content.
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-indigo-600 mx-auto rounded-full"></div>
          </div>
          
          {/* Library Types Section */}
          <div className="mb-16">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <Library className="h-5 w-5 text-amber-700" />
              <span>Library Types</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                        onClick={() => handleOpenCreateDialog(library.type)}
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
                      onClick={() => handleOpenCreateDialog(library.type)}
                    >
                      Create Library
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* My Libraries Section */}
          <div className="mb-16">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <Book className="h-5 w-5 text-amber-700" />
              <span>My Libraries</span>
            </h2>
            
            {Object.entries(groupedLibraries).length === 0 && (
              <div className="bg-amber-50/50 border border-amber-200 rounded-lg p-6 text-center">
                <p className="text-amber-800">You haven't created any libraries yet. Get started by creating your first library above!</p>
              </div>
            )}
            
            {Object.entries(groupedLibraries).map(([type, libraries]) => {
              if (libraries.length === 0) return null;
              
              const typeInfo = libraryTypes.find(t => t.type === type) || libraryTypes[0];
              
              return (
                <div key={type} className="mb-8">
                  <h3 className="text-lg font-medium mb-3 flex items-center gap-1.5">
                    {typeInfo.icon}
                    <span>{typeInfo.title}s</span>
                    <span className="ml-2 text-sm bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                      {libraries.length}
                    </span>
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {libraries.map(library => (
                      <div 
                        key={library.id}
                        className={`
                          p-4 rounded-lg border hover:shadow-lg transition-all cursor-pointer
                          ${typeInfo.borderClass} ${typeInfo.bgClass.replace('50', '100/60')}
                        `}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-2">
                            <div className={`p-1.5 rounded-md bg-white/80 ${typeInfo.borderClass}`}>
                              {typeInfo.icon}
                            </div>
                            <h4 className="font-medium">{library.name}</h4>
                          </div>
                          
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0 rounded-full"
                            onClick={(e) => {
                              e.stopPropagation();
                              setLibraryToEdit(library);
                              setNewLibraryName(library.name);
                              setIsEditDialogOpen(true);
                            }}
                          >
                            <Settings className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                        
                        <div className="flex justify-between items-center mt-2">
                          <div className="text-xs text-gray-600">
                            {library.rows} rows × {library.columns} columns
                          </div>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs h-7 px-2.5 bg-white/50 hover:bg-white/80"
                            onClick={() => navigate(`/library/${library.id}`)}
                          >
                            <span>Open</span>
                            <ArrowRight className="h-3 w-3 ml-1" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    
                    {/* Add New Library Button */}
                    <button
                      onClick={() => handleOpenCreateDialog(type)}
                      className={`
                        flex flex-col items-center justify-center gap-3 p-4 rounded-lg border-2 border-dashed
                        ${typeInfo.borderClass.replace('border-', 'border-')} min-h-[120px]
                        bg-white/30 hover:bg-white/60 transition-colors
                      `}
                    >
                      <div className={`p-2 rounded-full ${typeInfo.bgClass}`}>
                        <Plus className="h-5 w-5" />
                      </div>
                      <span className="text-sm font-medium">Add New {typeInfo.title}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* How to use section */}
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
      
      {/* Create Library Dialog */}
      <CreateLibraryDialog 
        open={isCreateLibraryOpen}
        onOpenChange={setIsCreateLibraryOpen}
      />
      
      {/* Edit Library Dialog */}
      <PopupWindow
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        title={
          <>
            <Edit3 className="h-5 w-5 text-amber-300" />
            <span>Edit Library</span>
          </>
        }
        size="md"
        footer={
          <>
            <Button 
              variant="outline" 
              onClick={() => setIsEditDialogOpen(false)}
              className="border-amber-700/30 text-amber-200 hover:bg-amber-950/30"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleEditLibrary}
              className="bg-gradient-to-b from-amber-700 to-amber-800 text-amber-100 hover:from-amber-600 hover:to-amber-700"
            >
              Save Changes
            </Button>
          </>
        }
      >
        <div className="space-y-6">
          <div className="popup-section">
            <h3 className="popup-section-title">Basic Details</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="edit-library-name" className="block text-sm font-medium text-amber-200 mb-1">
                  Library Name
                </label>
                <input
                  type="text"
                  id="edit-library-name"
                  value={newLibraryName}
                  onChange={(e) => setNewLibraryName(e.target.value)}
                  className="w-full px-3 py-2 bg-amber-950/30 border border-amber-700/30 rounded-md text-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-600/50"
                />
              </div>
            </div>
          </div>
          
          <div className="popup-section border-t border-amber-700/20 pt-4">
            <h3 className="popup-section-title text-red-300/70">Danger Zone</h3>
            <Button 
              variant="outline" 
              onClick={handleDeleteLibrary}
              className="w-full mt-2 border-red-700/30 text-red-300 hover:bg-red-950/30 hover:text-red-200"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Library
            </Button>
          </div>
        </div>
      </PopupWindow>
    </div>
  );
};

export default WidgetLauncher;
