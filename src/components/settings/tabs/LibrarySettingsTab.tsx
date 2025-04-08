
import React, { useState, useEffect } from 'react';
import { Settings, Trash2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from "@/components/ui/card";
import { ShelfData } from '@/store/types';
import { useBookshelfStore } from '@/store/bookshelfStore';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import LibraryNameSection from '@/components/library/settings/LibraryNameSection';
import DisplayOptionsSection from '@/components/library/settings/DisplayOptionsSection';
import { getThemeColors } from '@/components/library/settings/ThemedUtils';

interface LibrarySettingsTabProps {
  currentLibrary: ShelfData | null;
  libraryId: string;
  onCloseDrawer: () => void;
}

const LibrarySettingsTab: React.FC<LibrarySettingsTabProps> = ({
  currentLibrary,
  libraryId,
  onCloseDrawer
}) => {
  const { updateShelf, deleteShelf } = useBookshelfStore();
  const navigate = useNavigate();
  const [libraryName, setLibraryName] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  useEffect(() => {
    if (currentLibrary) {
      setLibraryName(currentLibrary.name);
    }
  }, [currentLibrary]);
  
  const handleUpdateSettings = () => {
    if (libraryId && libraryName.trim()) {
      updateShelf(libraryId, { name: libraryName });
      toast.success('Library settings updated');
    } else {
      toast.error('Library name cannot be empty');
    }
  };
  
  const handleDeleteLibrary = () => {
    if (libraryId) {
      deleteShelf(libraryId);
      setIsDeleteDialogOpen(false);
      onCloseDrawer();
      navigate('/widgets');
      toast.success('Library deleted successfully');
    }
  };
  
  const handleRowsChange = (rows: number) => {
    if (libraryId) {
      updateShelf(libraryId, { rows });
    }
  };
  
  const handleColumnsChange = (columns: number) => {
    if (libraryId) {
      updateShelf(libraryId, { columns });
    }
  };

  const themeColors = getThemeColors(currentLibrary);

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6 space-y-6">
          <LibraryNameSection 
            libraryName={libraryName}
            setLibraryName={setLibraryName}
            getThemeColors={() => themeColors}
          />
          
          <Button 
            onClick={handleUpdateSettings}
            className="w-full bg-gradient-to-b from-amber-600 to-amber-800 text-white hover:brightness-110 transition-all duration-300"
          >
            Save Library Name
          </Button>
          
          <DisplayOptionsSection 
            currentLibrary={currentLibrary}
            onRowsChange={handleRowsChange}
            onColumnsChange={handleColumnsChange}
            getThemeColors={() => themeColors}
          />
          
          <div className="popup-section bg-red-950/20 p-5 rounded-lg border border-red-800/30">
            <h3 className="popup-section-title text-lg font-semibold mb-3 flex items-center gap-2 text-red-300">
              <span className="h-2 w-2 rounded-full bg-red-500 inline-block"></span>
              Danger Zone
            </h3>

            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="outline" 
                  className="w-full border-red-800/30 bg-red-950/30 text-red-300 hover:bg-red-900/40 hover:text-red-200"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete this library
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-[#1A1F2C] border border-amber-700/30">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-red-300 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Delete Library
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-amber-100">
                    Are you sure you want to delete <span className="font-bold">"{currentLibrary?.name}"</span>?
                    <p className="text-red-300 mt-2">
                      This action cannot be undone and all items in this library will be permanently removed.
                    </p>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="border-amber-700/30 text-amber-200 hover:bg-amber-950/30">Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    className="bg-gradient-to-b from-red-500 to-red-700 text-white hover:from-red-400 hover:to-red-600"
                    onClick={handleDeleteLibrary}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LibrarySettingsTab;
